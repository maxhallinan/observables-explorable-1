import * as Rx from 'rxjs'
import {Sources, Sinks} from './interfaces'

type Point = {
  x: number;
  y: number;
}

type Node = {
  diameter: number;
  label: string;
  latestValue: string;
  point: Point;
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
    point: {
      x: 20.48,
      y: 10.24,
    },
    latestValue: '[WebSocket, http.IncomingMessage]'
  }, {
    diameter: 10.24,
    label: 'connectionCount$',
    latestValue: '3',
    point: {
      x: 10.24,
      y: 59.072,
    },
  }, {
    diameter: 10.24,
    label: 'socket$',
    latestValue: 'WebSocket',
    point: {
      x: 30.72,
      y: 107.904,
    },
  }, {
    diameter: 10.24,
    label: 'close$',
    latestValue: '[status, reason]',
    point: {
      x: 30.72,
      y: 156.736,
    },
  }, {
    diameter: 10.24,
    label: 'closeCount$',
    latestValue: '2',
    point: {
      x: 30.72,
      y: 205.568,
    },
  }, {
    diameter: 10.24,
    label: 'combinedCount$',
    latestValue: '[3, 2]',
    point: {
      x: 20.48,
      y: 254.40,
    },
  }, {
    diameter: 10.24,
    label: 'currentCount$',
    latestValue: '1',
    point: {
      x: 20.48,
      y: 303.232,
    },
  }, {
    diameter: 10.24,
    label: 'pause$',
    latestValue: 'true',
    point: {
      x: 20.48,
      y: 352.064,
    },
  }, {
    diameter: 10.24,
    label: 'tick$',
    latestValue: 'tick',
    point: {
      x: 20.48,
      y: 400.896,
    },
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

type State = {
  graph: Graph;
  isDisconnectDisabled: boolean;
}

const toState = ([ 
  graph,
  connection,
  connectionCount,
  socket,
  close,
  closeCount,
  combinedCount,
  currentCount,
  pause,
  tick,
]: [ 
  Graph, 
  Array<string>,
  number, 
  string,
  Array<string>,
  number,
  Array<number>,
  number,
  boolean,
  number
]): State => ({
  graph,
  isDisconnectDisabled: connectionCount <= closeCount,
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
}


const Node = (props: NodeProps) => {
  const { node, } = props;

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
        {state.graph.nodes.map((node) => <Node node={node} />)}
      </svg>
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

const subtract = (x1: number) => (x2: number): number => x1 - x1;

const head = (xs: Array<any>): any => xs[0];

const isPaused = (currentCount: number): boolean => currentCount < 1;

export function App(sources : Sources) : Sinks {
  const graph$ = Rx.Observable.of({
    edges,
    nodes,
  });

  const connectClick$ = 
    sources.DOM.select('.connect-btn').events('click');

  const connection$ =
    connectClick$.mapTo([ `WebSocket`, `http.IncomingMessage`, ]);

  const connectionCount$ = connection$.scan(addOne, 0);

  const socket$ =
    connection$.map(head);

  const disconnectClick$ =
    sources.DOM.select('.disconnect-btn').events('click');

  const close$ = disconnectClick$.mapTo([ `code`, `reason`, ]);

  const closeCount$ = disconnectClick$.scan(addOne, 0);

  const combinedCount$ = 
    Rx.Observable.combineLatest(connectionCount$, closeCount$);

  const currentCount$ = 
    combinedCount$.map(([ x1, x2 ]: Array<number>): number => subtract(x1)(x2));

  const pause$ = currentCount$.map(isPaused);

  const tick$ = pause$.switchMap(
    (isPaused: boolean): Rx.Observable<number> => 
      isPaused ? Rx.Observable.never() : Rx.Observable.timer(0, 1000)
  );

  const stateSource$ = Rx.Observable.combineLatest(
    graph$,
    connection$.startWith([]),
    connectionCount$.startWith(0),
    socket$.startWith(''),
    close$.startWith([]),
    closeCount$.startWith(0),
    combinedCount$.startWith([ 0, 0, ]),
    currentCount$.startWith(0),
    pause$.startWith(true),
    tick$.startWith(0),
  );

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(toView);

  return {
    DOM: vtree$
  }
}
