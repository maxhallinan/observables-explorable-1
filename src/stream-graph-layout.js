import { remToPx } from './rem-to-px';

/**
  Layout is based on a 1:1.25 modular scale: 
  http://www.modularscale.com/?1,1.5&em&1.25
*/

const numRangeOf = (length) => {
  let range = [];

  for (let i = 1; i <= length; i++) {
    range.push(i);
  }

  return range;
};

const toScale = (step) => (scale, _, index) => {
  const lastPoint = scale[index];

  // increment the last point on the scale by the given step
  const nextPoint = lastPoint + step;

  return [ ...scale, nextPoint ];
};

const xStep = remToPx(0.64); 

const toXScale = toScale(xStep);

const xScaleStart = 6; // 6px

export const xScale = numRangeOf(4).reduce(toXScale, [ xScaleStart, ]);

const yStep = remToPx(3.052 + 0.512);

const toYScale = toScale(yStep);

const yScaleStart = remToPx(0.64);

export const yScale = numRangeOf(9).reduce(toYScale, [ yScaleStart, ]);

const NODE_DIAMETER = remToPx(0.64);

const nodes = [
  {
    diameter: NODE_DIAMETER,
    label: 'connection$',
    latestValue: '[WebSocket, http.IncomingMessage]',
    point: {
      x: xScale[1],
      y: yScale[0],
    },
    timelineName: 'connections',
  }, {
    diameter: NODE_DIAMETER,
    label: 'connectionCount$',
    latestValue: '3',
    point: {
      x: xScale[0],
      y: yScale[1],
    },
    timelineName: 'connectionCounts',
  }, {
    diameter: NODE_DIAMETER,
    label: 'socket$',
    latestValue: 'WebSocket',
    point: {
      x: xScale[2],
      y: yScale[2],
    },
    timelineName: 'sockets',
  }, {
    diameter: NODE_DIAMETER,
    label: 'close$',
    latestValue: '[status, reason]',
    point: {
      x: xScale[2],
      y: yScale[3],
    },
    timelineName: 'closes',
  }, {
    diameter: NODE_DIAMETER,
    label: 'closeCount$',
    latestValue: '2',
    point: {
      x: xScale[2],
      y: yScale[4],
    },
    timelineName: 'closeCounts',
  }, {
    diameter: NODE_DIAMETER,
    label: 'combinedCount$',
    latestValue: '[3, 2]',
    point: {
      x: xScale[1],
      y: yScale[5],
    },
    timelineName: 'combinedCounts',
  }, {
    diameter: NODE_DIAMETER,
    label: 'currentCount$',
    latestValue: '1',
    point: {
      x: xScale[1],
      y: yScale[6],
    },
    timelineName: 'currentCounts',
  }, {
    diameter: NODE_DIAMETER,
    label: 'pause$',
    latestValue: 'true',
    point: {
      x: xScale[1],
      y: yScale[7],
    },
    timelineName: 'pauses',
  }, {
    diameter: NODE_DIAMETER,
    label: 'tick$',
    latestValue: 'tick',
    point: {
      x: xScale[1],
      y: yScale[8],
    },
    timelineName: 'ticks',
  }
];

const edges = [
  {
    label: 'connection$ -> connectionCount$',
    points: [
      {
        x: xScale[1],
        y: yScale[0],
      }, {
        x: xScale[0],
        y: yScale[1],
      }
    ],
  }, {
    label: 'connection$ -> socket$',
    points: [
      {
        x: xScale[1],
        y: yScale[0],
      }, {
        x: xScale[2],
        y: yScale[1],
      }, {
        x: xScale[2],
        y: yScale[2],
      }
    ],
  }, {
    label: 'socket$ -> close$',
    points: [
      {
        x: xScale[2],
        y: yScale[2],
      }, {
        x: xScale[2],
        y: yScale[3],
      }
    ],
  }, {
    label: 'close$ -> closeCount$',
    points: [
      {
        x: xScale[2],
        y: yScale[3],
      }, {
        x: xScale[2],
        y: yScale[4],
      }
    ],
  }, {
    label: 'closeCount$ -> combinedCount$',
    points: [
      {
        x: xScale[2],
        y: yScale[4],
      }, {
        x: xScale[1],
        y: yScale[5],
      }
    ]
  }, {
    label: 'connectionCount$ -> combinedCount$',
    points: [
      {
        x: xScale[0],
        y: yScale[1],
      }, {
        x: xScale[0],
        y: yScale[4]
      }, {
        x: xScale[1],
        y: yScale[5]
      },
    ]
  }, {
    label: 'combinedCount$ -> currentCount$',
    points: [
      {
        x: xScale[1],
        y: yScale[5],
      }, {
        x: xScale[1],
        y: yScale[6],
      }
    ]
  }, {
    label: 'currentCount$ -> pause$',
    points: [
      {
        x: xScale[1],
        y: yScale[6],
      }, {
        x: xScale[1],
        y: yScale[7],
      }
    ]
  }, {
    label: 'pause$ -> tick$',
    points: [
      {
        x: xScale[1],
        y: yScale[7],
      }, {
        x: xScale[1],
        y: yScale[8],
      }
    ]
  }, {
    label: 'tick$ ->',
    points: [
      {
        x: xScale[1],
        y: yScale[8],
      }, {
        x: xScale[1],
        y: yScale[9],
      }
    ]
  }, {
    label: '->',
    points: [
      {
        x: xScale[1] - remToPx(0.262),
        y: yScale[9] - remToPx(0.262),
      }, {
        x: xScale[1],
        y: yScale[9],
      }, {
        x: xScale[1] + remToPx(0.262),
        y: yScale[9] - remToPx(0.262),
      }
    ]
  },
];

export const graphLayout = { edges, nodes, };
