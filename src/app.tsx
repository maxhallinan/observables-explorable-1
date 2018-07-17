import * as Rx from 'rxjs'
import {Sources, Sinks} from './interfaces'

interface IPoint {
  x: number;
  y: number;
}

interface INode {
  label: string;
  height: number;
  width: number;
  point: IPoint;
}

const nodes: Array<INode> = [
  {
    label: 'connection$',
    height: 10,
    point: {
      x: 20,
      y: 10,
    },
    width: 10,
  }, {
    label: 'socket$',
    height: 10,
    point: {
      x: 30,
      y: 50,
    },
    width: 10,
  }, {
    label: 'close$',
    height: 10,
    point: {
      x: 30,
      y: 90,
    },
    width: 10,
  }, {
    label: 'closeCount$',
    height: 10,
    point: {
      x: 30,
      y: 130,
    },
    width: 10,
  }, {
    label: 'connectionCount$',
    height: 10,
    point: {
      x: 10,
      y: 170,
    },
    width: 10,
  }, {
    label: 'combinedCount$',
    height: 10,
    point: {
      x: 20,
      y: 210,
    },
    width: 10,
  }, {
    label: 'currentCount$',
    height: 10,
    point: {
      x: 20,
      y: 250,
    },
    width: 10,
  }, {
    label: 'pause$',
    height: 10,
    point: {
      x: 20,
      y: 290,
    },
    width: 10,
  }, {
    label: 'tick$',
    height: 10,
    point: {
      x: 20,
      y: 330,
    },
    width: 10,
  }
];

interface IEdge {
  label: string;
  points: Array<IPoint>
}


const edges: Array<IEdge> = [
  { 
    label: '',
    points: [
      {
        x: 20,
        y: 10,
      }, {
        x: 10,
        y: 50,
      }, {
        x: 10,
        y: 170,
      },
    ],
  }, { 
    label: '',
    points: [
      {
        x: 20,
        y: 10,
      }, {
        x: 30,
        y: 50,
      }
    ],
  }, { 
    label: '',
    points: [
      {
        x: 30,
        y: 50,
      }, {
        x: 30,
        y: 90,
      }
    ],
  }, { 
    label: '',
    points: [
      {
        x: 30,
        y: 90,
      }, {
        x: 30,
        y: 130,
      }
    ],
  }, {
    label: '',
    points: [
      {
        x: 30,
        y: 130,
      }, {
        x: 30,
        y: 170,
      }, {
        x: 20,
        y: 210,
      }
    ]
  }, {
    label: '',
    points: [
      {
        x: 10,
        y: 170,
      }, {
        x: 20,
        y: 210,
      }
    ]
  }, {
    label: '',
    points: [
      {
        x: 20,
        y: 210,
      }, {
        x: 20,
        y: 250,
      }
    ]
  }, {
    label: '',
    points: [
      {
        x: 20,
        y: 250,
      }, {
        x: 20,
        y: 290,
      }
    ]
  }, {
    label: '',
    points: [
      {
        x: 20,
        y: 290,
      }, {
        x: 20,
        y: 330,
      }
    ]
  },
];

interface IGraph {
  edges: Array<IEdge>;
  nodes: Array<INode>;
}

interface IState {
  graph: IGraph;
}

const toState = (graph: IGraph): IState => ({
  graph,
});

const toView = (state: IState) => {
  return (
    <div>
      <svg width="100%">
        
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
