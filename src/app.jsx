import * as d3 from 'd3';
import * as Rx from 'rxjs'

import { remToPx } from './rem-to-px';
import { graphLayout, xScale as graphXScale, } from './stream-graph-layout';
import * as styles from './styles';

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

  const pathStartXCoord = graphXScale[3];
  const pathEndXCoord = 851;
  const arrowHeadLength = remToPx(0.262);
  const circleSize = remToPx(0.41);
  const barXCoord = pathEndXCoord - remToPx(0.64);
  const timelineEnd = barXCoord - (circleSize / 2) - 2.25 - arrowHeadLength;
  const maxCircles =
    Math.floor((timelineEnd - pathStartXCoord) / (circleSize + arrowHeadLength));
  const domainEnd = currentTimeRange.current;
  const domainStart = domainEnd - (maxCircles * 500);
  const domain = [ domainStart, domainEnd, ];
  const range = [
    40.96 + (6.56 / 2), // align left edge of circle with start of timeline
    timelineEnd,
  ];

  const getXCoord = d3.scaleLinear()
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
        className={`${styles.code} ${styles.streamCurrentValue}`}
        fill="#333"
        x={pathEndXCoord - 10.24 + 3}
        y={node.point.y + (16 * 1.563)}>
        {displayValue}
      </text>
      <text
        className={styles.code}
        fill="#333"
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
            cx={getXCoord(timestamp)}
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
  const graph$ = Rx.Observable.of(graphLayout);

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
      isPaused ? Rx.Observable.never() : Rx.Observable.timer(0, 1250)
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
