import * as Rx from 'rxjs'
import {Sources, Sinks} from './interfaces'

type Point = {
  x: number;
  y: number;
}

type Node = {
  diameter: number;
  label: string;
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
  }, {
    diameter: 10.24,
    label: 'socket$',
    point: {
      x: 30.72,
      y: 59.072,
    },
  }, {
    diameter: 10.24,
    label: 'close$',
    point: {
      x: 30.72,
      y: 107.904,
    },
  }, {
    diameter: 10.24,
    label: 'closeCount$',
    point: {
      x: 30.72,
      y: 156.736,
    },
  }, {
    diameter: 10.24,
    label: 'connectionCount$',
    point: {
      x: 10.24,
      y: 205.568,
    },
  }, {
    diameter: 10.24,
    label: 'combinedCount$',
    point: {
      x: 20.48,
      y: 254.40,
    },
  }, {
    diameter: 10.24,
    label: 'currentCount$',
    point: {
      x: 20.48,
      y: 303.232,
    },
  }, {
    diameter: 10.24,
    label: 'pause$',
    point: {
      x: 20.48,
      y: 352.064,
    },
  }, {
    diameter: 10.24,
    label: 'tick$',
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
      }, {
        x: 10.24,
        y: 205.568,
      },
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
      }
    ],
  }, {
    label: 'socket$ -> close$',
    points: [
      {
        x: 30.72,
        y: 59.072,
      }, {
        x: 30.72,
        y: 107.904,
      }
    ],
  }, {
    label: 'close$ -> closeCount$',
    points: [
      {
        x: 30.72,
        y: 107.904,
      }, {
        x: 30.72,
        y: 156.736,
      }
    ],
  }, {
    label: 'closeCount$ -> combinedCount$',
    points: [
      {
        x: 30.72,
        y: 156.736,
      }, {
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
        y: 205.568,
      }, {
        x: 20.48,
        y: 254.40,
      }
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
}

const toState = (graph: Graph): State => ({
  graph,
});


type NodeProps = {
  node: Node;
}

const Node = (props: NodeProps, key: number) => {
  const { node, } = props;

  return (
    <g key={key}>
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

const Edge = (props: EdgeProps, key: number) => {
  const { edge, } = props;

  return (
    <g key={key}>
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
    </div>
  );
};

export function App(sources : Sources) : Sinks {
  const graph$ = Rx.Observable.of({
    edges,
    nodes,
  });

  const state$ = graph$.map(toState);

  const vtree$ = state$.map(toView);

  return {
    DOM: vtree$
  }
}
