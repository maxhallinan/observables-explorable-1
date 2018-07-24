import * as d3 from 'd3';
import * as Rx from 'rxjs'

import * as styles from './styles';

// The positions and sizes based on a 1:1.25 modular scale where 1em = 16px:
// http://www.modularscale.com/?1,1.5&em&1.25
// x-axis increments are multiples of 10.25px (0.64em)
// y-axis increments are multiples of 48.832px (3.052em)
const nodes = [
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

const edges = [
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
  }, {
    label: 'tick$ ->',
    points: [
      {
        x: 20.48,
        y: 400.896,
      }, {
        x: 20.48,
        y: 400.896 + (3.052 * 16),
      }
    ]
  }, {
    label: '->',
    points: [
      {
        x: 20.48 - (0.262 * 16),
        y: 400.896 + (3.052 * 16) - 4.192,
      }, {
        x: 20.48,
        y: 400.896 + (3.052 * 16),
      }, {
        x: 20.48 + (0.262 * 16),
        y: 400.896 + (3.052 * 16) - 4.192,
      }
    ]
  },
];

const toState = ([
  graph,
  isDisconnectDisabled,
  timelineTable,
  timeRange,
  currentTimeRange,
]) => ({
  graph,
  isDisconnectDisabled,
  timelineTable,
  timeRange,
  currentTimeRange,
});

const Timeline = (props) => {
  const { currentTimeRange, node, timeline, timeRange, } = props;

  const pathStartXCoord = 40.96;
  // const pathEndXCoord = 55.51 * 16;
  const pathEndXCoord = 35.527 * 16;
  const arrowHeadLength = 0.262 * 16;
  const circleSize = 0.41 * 16;
  const barXCoord = pathEndXCoord - (16 * 0.64);
  const timelineEnd = barXCoord - (circleSize / 2) - 2.25 - arrowHeadLength;
  const maxCircles =
    Math.floor((timelineEnd - pathStartXCoord) / (circleSize + arrowHeadLength));
  const domainEnd = currentTimeRange.current;
  const domainStart = domainEnd - (maxCircles * 750);
  const domain = [ domainStart, domainEnd, ];
  const range = [
    40.96 + (6.56 / 2), // align left edge of circle with start of timeline
    timelineEnd,
  ];

  const xScale = d3.scaleLinear()
    .domain(domain)
    .range(range);

  const currentTimeline =
    timeline.filter(([ timestamp ]) => timestamp <= domainEnd);

  const currentValue = currentTimeline.length > 0
    ? currentTimeline[currentTimeline.length - 1][1]
    : '';

  const displayValue = typeof currentValue === 'string'
    ? currentValue
    : JSON.stringify(currentValue);

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
        className={styles.code}
        fill="#333"
        fontSize="10"
        x={pathEndXCoord + 10.24}
        y={node.point.y + 3}>
        {/*node.label*/}
        {displayValue}
      </text>
      <text
        className={styles.code}
        fill="#333"
        fontSize="10"
        x={pathStartXCoord}
        y={node.point.y + (16 * 1.25)}>
          {node.label}
      </text>
      {timeline.filter(([ timestamp ]) => timestamp > domainStart && timestamp <= domainEnd).map(([ timestamp ]) => {
        return (
          <circle
            className="timeline-point"
            fill="#444"
            stroke="#444"
            cx={xScale(timestamp)}
            cy={node.point.y}
            r={circleSize / 2}
          />
        );
      })}
    </g>
  );
};

const Node = (props) => {
  const { node, timelineTable, timeRange, } = props;
  const timeline = timelineTable[node.timelineName];

  return (
    <g>
      <Timeline
        currentTimeRange={props.currentTimeRange}
        node={node}
        timeline={timeline}
        timeRange={timeRange}
      />
      <circle
        fill="white"
        stroke="#333"
        cx={node.point.x}
        cy={node.point.y}
        r={node.diameter / 2}
      />
    </g>
  );
}

const toSvgMoveToCmd = (point) => `M${point.x} ${point.y}`;

const toSvgLineToCmd = (point) => `L${point.x} ${point.y}`;

const toSvgLineToCmds = (points) => points.reduce(
  (acc, point) => `${acc}${toSvgLineToCmd(point)}`,
  ``
);

const toSvgPathDAttr = ([ pointsHead, ...pointsTail ]) =>
  `${toSvgMoveToCmd(pointsHead)}${toSvgLineToCmds(pointsTail)}`;

const Edge = (props) => {
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

const toView = (state) => {
  return (
    <div>
      <svg
        className={styles.explorable}
        width="100%"
      >
        {state.graph.edges.map((edge) => <Edge edge={edge} />)}
        {state.graph.nodes.map((node) => (
          <Node
            currentTimeRange={state.currentTimeRange}
            node={node}
            timelineTable={state.timelineTable}
            timeRange={state.timeRange}
          />
        ))}
      </svg>
      <div className={styles.controls}>
        <button
          className={`${styles.controlItem} js-connect`}
        >
            Connect
        </button>
        <button
          className={`${styles.controlItem} js-disconnect`}
          disabled={state.isDisconnectDisabled}
        >
            Disconnect
        </button>
        <input
          className={`${styles.controlItem} js-timerange`}
          max={1}
          min={0}
          step={0.01}
          type="range"
          value={state.currentTimeRange.currentPercent}
        />
      </div>
    </div>
  );
};

const add = (x1) => (x2) => x1 + x2;

const addOne = add(1);

const subtract = (x1) => (x2) => x1 - x2;

const head = (xs) => xs[0];

const isPaused = (currentCount) => currentCount < 1;

const toTimeIndexed = (x) => [ Date.now(), x, ];

const toTimeline = (timeline, timeIndexed) => [ ...timeline, timeIndexed, ];

export function App(sources) {
  const graph$ = Rx.Observable.of({
    edges,
    nodes,
  });

  const rangeInputEvent$ = sources.DOM.select('.js-timerange')
    .events('input');

  const rangeInputValue$ = rangeInputEvent$
    .map((event) => Number(event.target.value));

  const rangeChangeEvent$ = sources.DOM.select('.js-timerange')
    .events('change');

  const rangeChangeValue$ = rangeChangeEvent$
    .map((event) => Number(event.target.value));

  const connectClick$ =
    sources.DOM.select('.js-connect').events('click');

  const connection$ =
    connectClick$.mapTo(`[ WebSocket, http.IncomingMessage ]`);

  const connectionCount$ = connection$.scan(addOne, 0).startWith(0);

  const socket$ =
    connection$.mapTo(`WebSocket`);

  const disconnectClick$ =
    sources.DOM.select('.js-disconnect').events('click');

  const close$ = disconnectClick$.mapTo(`[ code, reason ]`);

  const closeCount$ = disconnectClick$.scan(addOne, 0).startWith(0);

  const combinedCount$ =
    Rx.Observable.combineLatest(connectionCount$, closeCount$);

  const currentCount$ =
    combinedCount$.map(([ x1, x2 ]) => subtract(x1)(x2));

  const pause$ = currentCount$.map(isPaused);

  const tick$ = pause$.switchMap(
    (isPaused) =>
      isPaused ? Rx.Observable.never() : Rx.Observable.timer(0, 1000)
  );

  const timelineSources = [
    connection$,
    connectionCount$,
    socket$,
    close$,
    closeCount$,
    combinedCount$,
    currentCount$,
    pause$,
    tick$,
  ];

  const [
    connectionTimeline$,
    connectionCountTimeline$,
    socketTimeline$,
    closeTimeline$,
    closeCountTimeline$,
    combinedCountTimeline$,
    currentCountTimeline$,
    pauseTimeline$,
    tickTimeline$,
  ] = timelineSources.map((observable) => observable
      .map(toTimeIndexed)
      .scan(toTimeline, [])
      .startWith([])
    );

  const timeline$ = Rx.Observable.combineLatest(
    connectionTimeline$,
    connectionCountTimeline$,
    socketTimeline$,
    closeTimeline$,
    closeCountTimeline$,
    combinedCountTimeline$,
    currentCountTimeline$,
    pauseTimeline$,
    tickTimeline$,
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
  ]) => ({
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

  const timeRange$ = timeline$
    .map((timelines) => timelines.reduce((ts, t) => [ ...ts, ...t ], []))
    .map((timelines) => timelines.map(([ timestamp ]) => timestamp))
    .map((timestamps) => timestamps.sort((n1, n2) => n1 - n2))
    .map((timestamps) => [ timestamps[0], timestamps[timestamps.length - 1], ]);

  // get the percent of the timeline
  const currentTimeRange$ = Rx.Observable.combineLatest(
    timeRange$,
    rangeInputValue$.startWith(1),
  ).map(([ timeRange, currentPercent, ]) => {
    const start = timeRange[0];
    const end = timeRange[1];

    const getCurrent = d3.scaleLinear()
      .domain([ 0, 1 ])
      .range([start, end]);

    return {
      currentPercent,
      current: getCurrent(currentPercent),
      end,
      start,
    };
  })

  const isDisconnectDisabled$ = Rx.Observable.combineLatest(
    connectionCount$,
    closeCount$,
  ).map(function ([
    connectionCount,
    closeCount,
  ]) {
    return connectionCount <= closeCount;
  });

  const stateSource$ = Rx.Observable.combineLatest(
    graph$,
    isDisconnectDisabled$,
    timelineTable$,
    timeRange$,
    currentTimeRange$,
  );

  const state$ = stateSource$.map(toState);

  const vtree$ = state$.map(toView);

  return {
    DOM: vtree$
  }
}
