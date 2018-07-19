import * as Rx from 'rxjs'
import {Sources, Sinks} from './interfaces'

type Point = {
  x: number;
  y: number;
}

type TimelineName 
  = 'connections' 
  | 'connectionCounts' 
  | 'sockets'  
  | 'closes'
  | 'closeCounts'
  | 'combinedCounts'
  | 'currentCounts'
  | 'pauses'
  | 'ticks'

type Node = {
  diameter: number;
  label: string;
  latestValue: string;
  point: Point;
  timelineName: TimelineName;
}

// positions and sizes based on 1:1.25 module scale
// modular scale: http://www.modularscale.com/?1,1.5&em&1.25
// 1rem @16px
// x-axis increments are multiples of 10.25px (0.64rem)
// y-axis increments are multiples of 48.832px (3.052em)
const nodes: Array<Node> = [
  {
    diameter: 10.24,
    label: 'connection$',
    latestValue: '[WebSocket, http.IncomingMessage]',
    point: {
      x: 20.48,
      y: 10.24,
    },
    timelineName: 'connections',
  }, {
    diameter: 10.24,
    label: 'connectionCount$',
    latestValue: '3',
    point: {
      x: 10.24,
      y: 59.072,
    },
    timelineName: 'connectionCounts',
  }, {
    diameter: 10.24,
    label: 'socket$',
    latestValue: 'WebSocket',
    point: {
      x: 30.72,
      y: 107.904,
    },
    timelineName: 'sockets',
  }, {
    diameter: 10.24,
    label: 'close$',
    latestValue: '[status, reason]',
    point: {
      x: 30.72,
      y: 156.736,
    },
    timelineName: 'closes',
  }, {
    diameter: 10.24,
    label: 'closeCount$',
    latestValue: '2',
    point: {
      x: 30.72,
      y: 205.568,
    },
    timelineName: 'closeCounts',
  }, {
    diameter: 10.24,
    label: 'combinedCount$',
    latestValue: '[3, 2]',
    point: {
      x: 20.48,
      y: 254.40,
    },
    timelineName: 'combinedCounts',
  }, {
    diameter: 10.24,
    label: 'currentCount$',
    latestValue: '1',
    point: {
      x: 20.48,
      y: 303.232,
    },
    timelineName: 'currentCounts',
  }, {
    diameter: 10.24,
    label: 'pause$',
    latestValue: 'true',
    point: {
      x: 20.48,
      y: 352.064,
    },
    timelineName: 'pauses',
  }, {
    diameter: 10.24,
    label: 'tick$',
    latestValue: 'tick',
    point: {
      x: 20.48,
      y: 400.896,
    },
    timelineName: 'ticks',
  }
];

type Edge = {
  label: string;
  points: Array<Point>
}

const edges: Array<Edge> = [
  {
    label: 'connection$ -> connectionCount$',
    points: [
      {
        x: 20.48,
        y: 10.24,
      }, {
        x: 10.24,
        y: 59.072,
      }
    ],
  }, {
    label: 'connection$ -> socket$',
    points: [
      {
        x: 20.48,
        y: 10.25,
      }, {
        x: 30.72,
        y: 59.072,
      }, {
        x: 30.72,
        y: 107.904,
      }
    ],
  }, {
    label: 'socket$ -> close$',
    points: [
      {
        x: 30.72,
        y: 107.904,
      }, {
        x: 30.72,
        y: 156.736
      }
    ],
  }, {
    label: 'close$ -> closeCount$',
    points: [
      {
        x: 30.72,
        y: 156.736,
      }, {
        x: 30.72,
        y: 205.568,
      }
    ],
  }, {
    label: 'closeCount$ -> combinedCount$',
    points: [
      {
        x: 30.72,
        y: 205.568,
      }, {
        x: 20.48,
        y: 254.40,
      }
    ]
  }, {
    label: 'connectionCount$ -> combinedCount$',
    points: [
      {
        x: 10.24,
        y: 59.072,
      }, {
        x: 10.24,
        y: 205.568,
      }, {
        x: 20.48,
        y: 254.40,
      },
    ]
  }, {
    label: 'combinedCount$ -> currentCount$',
    points: [
      {
        x: 20.48,
        y: 254.40,
      }, {
        x: 20.48,
        y: 303.232,
      }
    ]
  }, {
    label: 'currentCount$ -> pause$',
    points: [
      {
        x: 20.48,
        y: 303.232,
      }, {
        x: 20.48,
        y: 352.064,
      }
    ]
  }, {
    label: 'pause$ -> tick$',
    points: [
      {
        x: 20.48,
        y: 352.064,
      }, {
        x: 20.48,
        y: 400.896,
      }
    ]
  },
];

type Graph = {
  edges: Array<Edge>;
  nodes: Array<Node>;
}

type TimelineTable = {
  connections: Timeline<[string, string]>;
  connectionCounts: Timeline<number>;
  sockets: Timeline<string>;
  closes: Timeline<[string, string]>;
  closeCounts: Timeline<number>;
  combinedCounts: Timeline<number>;
  currentCounts: Timeline<number>;
  pauses: Timeline<boolean>;
  ticks: Timeline<number>;
}

type State = {
  graph: Graph;
  isDisconnectDisabled: boolean;
  timelineTable: TimelineTable;
}

const toState = ([
  graph,
  isDisconnectDisabled,
  timelineTable,
]: [
  Graph,
  boolean,
  TimelineTable
]): State => ({
  graph,
  isDisconnectDisabled,
  timelineTable,
});

type TimelineProps = {
  node: Node;
}

const Timeline = (props: TimelineProps) => {
  const { node, } = props;
  const pathStartXCoord = 40.96;
  const pathEndXCoord = 825;
  const arrowHeadLength = 4.192;

  return (
    <g>
      <path
        d={`M${pathStartXCoord} ${node.point.y}L${pathEndXCoord} ${node.point.y}`}
        fill="transparent"
        stroke="#333"
        strokeWidth="1.25px"
      />
      <path
        d={`M${pathEndXCoord - 10.24},${node.point.y + arrowHeadLength} L${pathEndXCoord - 10.24},${node.point.y - arrowHeadLength}`}
        fill="transparent"
        stroke="#333"
        strokeWidth="1.25px"
      />
      <path
        d={`M${pathEndXCoord - arrowHeadLength},${node.point.y - arrowHeadLength} L${pathEndXCoord + 1},${node.point.y}`}
        fill="transparent"
        stroke="#333"
        strokeWidth="1.25px"
      />
      <path
        d={`M${pathEndXCoord - arrowHeadLength},${node.point.y + arrowHeadLength} L${pathEndXCoord + 1},${node.point.y}`}
        fill="transparent"
        stroke="#333"
        strokeWidth="1.25px"
      />
      <text
        className="code"
        fill="#333"
        fontSize="10"
        x={pathEndXCoord + 10.24}
        y={node.point.y + 3}>
          {node.latestValue}
        </text>
      <circle
        fill="#333"
        stroke="#333"
        strokeWidth="1.25px"
        cx={node.point.x + 50}
        cy={node.point.y}
        r={6.56 / 2}
      />
    </g>
  );
};

type NodeProps = {
  node: Node;
  timelineTable: TimelineTable;
}


const Node = (props: NodeProps) => {
  const { node, timelineTable, } = props;
  const timeline = timelineTable[node.timelineName];

  return (
    <g>
      <Timeline node={node} />
      <circle
        fill="white"
        stroke="#333"
        strokeWidth="1.25px"
        cx={node.point.x}
        cy={node.point.y}
        r={node.diameter / 2}
      />
    </g>
  );
}

const toSvgMoveToCmd = (point: Point): string =>
  `M${point.x} ${point.y}`;

const toSvgLineToCmd = (point: Point): string =>
  `L${point.x} ${point.y}`;

const toSvgLineToCmds = (points: Array<Point>): string =>
  points.reduce(
    (acc, point) => `${acc}${toSvgLineToCmd(point)}`,
    ``
  );

const toSvgPathDAttr = ([ pointsHead, ...pointsTail ]: Array<Point>) =>
  `${toSvgMoveToCmd(pointsHead)}${toSvgLineToCmds(pointsTail)}`;

type EdgeProps = {
  edge: Edge;
};

const Edge = (props: EdgeProps) => {
  const { edge, } = props;

  return (
    <g>
      <path
        d={toSvgPathDAttr(edge.points)}
        fill="transparent"
        stroke="#333"
        strokeWidth="1.25px"
      />
    </g>
  );
};

const toView = (state: State) => {
  return (
    <div>
      <svg width="100%">
        {state.graph.edges.map((edge) => <Edge edge={edge} />)}
        {state.graph.nodes.map((node) => <Node node={node} timelineTable={state.timelineTable} />)}
      </svg>
      <div>
        <input width="100%" type="range" min="0" max="100" value="7" step="1" />
      </div>
      <button
        className="connect-btn"
      >
          Connect
      </button>
      <button
        className="disconnect-btn"
        disabled={state.isDisconnectDisabled}
      >
          Disconnect
      </button>
    </div>
  );
};

const add = (x1: number) => (x2: number): number => x1 + x2;

const addOne = add(1);

const subtract = (x1: number) => (x2: number): number => x1 - x2;

const head = (xs: Array<any>): any => xs[0];

const isPaused = (currentCount: number): boolean => currentCount < 1;

type TimeIndexed<A> = [ number, A ];

function toTimeIndexed<A>(x: A): TimeIndexed<A> {
  return [ Date.now(), x ];
}

type Timeline<A> = Array<TimeIndexed<A>>;

function toTimeline<A>(
  timeline: Timeline<A>,
  timeIndexed: TimeIndexed<A>
): Timeline<A> {
  return [
    ...timeline,
    timeIndexed
  ];
}

function append<A>(xs: Array<A>, x: A): Array<A> {
  return [ ...xs, x ];
}

export function App(sources : Sources) : Sinks {
  const graph$ = Rx.Observable.of({
    edges,
    nodes,
  });

  const connectClick$ =
    sources.DOM.select('.connect-btn').events('click');

  const connection$ =
    connectClick$.mapTo([ `WebSocket`, `http.IncomingMessage`, ]);

  const connectionCount$ = connection$.scan(addOne, 0).startWith(0);

  const socket$ =
    connection$.map(head);

  const disconnectClick$ =
    sources.DOM.select('.disconnect-btn').events('click');

  const close$ = disconnectClick$.mapTo([ `code`, `reason`, ]);

  const closeCount$ = disconnectClick$.scan(addOne, 0).startWith(0);

  const combinedCount$ =
    Rx.Observable.combineLatest(connectionCount$, closeCount$);

  const currentCount$ =
    combinedCount$.map(([ x1, x2 ]: Array<number>): number => subtract(x1)(x2));

  const pause$ = currentCount$.map(isPaused);

  const tick$ = pause$.switchMap(
    (isPaused: boolean): Rx.Observable<number> =>
      isPaused ? Rx.Observable.never() : Rx.Observable.timer(0, 1000)
  );

  const timelineTable$ = Rx.Observable.combineLatest(
    connection$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    connectionCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    socket$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    close$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    closeCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    combinedCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    currentCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    pause$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    tick$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
  ).map(([
    connections,
    connectionCounts,
    sockets,
    closes,
    closeCounts,
    combinedCounts,
    currentCounts,
    pauses,
    ticks,
  ]: [
    Timeline<[string, string]>,
    Timeline<number>,
    Timeline<string>,
    Timeline<[string, string]>,
    Timeline<number>,
    Timeline<number>,
    Timeline<number>,
    Timeline<boolean>,
    Timeline<number>
  ]): TimelineTable => ({
    connections,
    connectionCounts,
    sockets,
    closes,
    closeCounts,
    combinedCounts,
    currentCounts,
    pauses,
    ticks,
  }));

  const isDisconnectDisabled$ = Rx.Observable.combineLatest(
    connectionCount$,
    closeCount$,
  ).map(function ([ connectionCount, closeCount]: [ number, number ]): boolean {
    return connectionCount <= closeCount;
  });

  const stateSource$ = Rx.Observable.combineLatest(
    graph$,
    isDisconnectDisabled$,
    timelineTable$,
  );

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(toView);

  return {
    DOM: vtree$
  }
}
