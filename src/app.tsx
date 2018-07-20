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
  connections: Timeline<string>;
  connectionCounts: Timeline<number>;
  sockets: Timeline<string>;
  closes: Timeline<string>;
  closeCounts: Timeline<number>;
  combinedCounts: Timeline<Array<number>>;
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
    connectClick$.mapTo(`[ WebSocket, http.IncomingMessage ]`);

  const connectionCount$ = connection$.scan(addOne, 0).startWith(0);

  const socket$ =
    connection$.mapTo(`WebSocket`);

  const disconnectClick$ =
    sources.DOM.select('.disconnect-btn').events('click');

  const close$ = disconnectClick$.mapTo(`[ code, reason ]`);

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

  /*
    Combining the timeline streams in three steps is necessary to assert the 
    type of each stream.
    The arguments to `combineLatest` are typed an array when called on more 
    than six streams.
    Example: `Rx.Observable.combineLatest( Rx.Observable.of(true), Rx.Observable.of(''), Rx.Observable.of(1), Rx.Observable.of(true), Rx.Observable.of(''), Rx.Observable.of(1), Rx.Observable.of(2), Rx.Observable.of(''), Rx.Observable.of(false),).map(([ x1, x2, x3, x4, x5, x6, x7, x8, x9, ]: [ boolean, string, number, boolean, string, number, number, string, boolean ]) => ({ x1, x2, x3, x4, x5, x6, x7, x8, x9 }));`
    It is possible to type that array as a union of the types: 
    `Array<Timeline<string | number | ...>>`.
    But then it is not possible to go from this type to the State type, which
    types each stream as one specific side of that union.
  */
  const timeline1$ = Rx.Observable.combineLatest(
    connection$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    connectionCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    socket$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    close$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
  );

  const timeline2$ = Rx.Observable.combineLatest(
    combinedCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    currentCount$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    pause$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
    tick$.map(toTimeIndexed).scan(toTimeline, []).startWith([]),
  );

  const timeline$= Rx.Observable.combineLatest(
    timeline1$,
    timeline2$,
    ([ s1, s2, s3, s4, s5 ]: [
      Timeline<string>, // connections
      Timeline<number>, // connectionCounts
      Timeline<string>, // sockets
      Timeline<string>, // closes
      Timeline<number> // closeCounts
    ], [ s6, s7, s8, s9 ]: [
      Timeline<Array<number>>, // combinedCounts
      Timeline<number>, // currentCounts
      Timeline<boolean>, // pauses
      Timeline<number> // ticks
    ]): [
      Timeline<string>, // connections
      Timeline<number>, // connectionCounts
      Timeline<string>, // sockets
      Timeline<string>, // closes
      Timeline<number>, // closeCounts
      Timeline<Array<number>>, // combinedCounts
      Timeline<number>, // currentCounts
      Timeline<boolean>, // pauses
      Timeline<number> // ticks
    ] => [ s1, s2, s3, s4, s5, s6, s7, s8, s9 ]
  );

  const timelineTable$ = timeline$.map(([
    connections,
    connectionCounts,
    sockets,
    closes,
    closeCounts,
    combinedCounts,
    currentCounts,
    pauses,
    ticks,
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
