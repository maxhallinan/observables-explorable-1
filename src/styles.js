import { style } from 'typestyle';

import { remToPx } from './rem-to-px';

export const explorable = style({
  display: 'block',
  height: '536.24px',
});

export const code = style({
  fontFamily: '"Pitch", monospace',
  fontSize: remToPx(1),
});

export const streamCurrentValue = style({
  textAnchor: 'end',
})

export const controls = style({
  alignItems: 'center',
  display: 'flex',
});

export const controlItem = style({
  display: 'block',
});

export const controlButtonFirst = style({
  margin: '0 0.512rem 0 0',
});

export const controlButton = style({
  display: 'inline-block',
  fontFamily: '"TiemposText", serif',
  fontSize: '0.8rem',
  fontWeight: 400,
});

export const timeRange = style({
  alignItems: 'center',
  display: 'flex',
  marginLeft: 'auto',
});

export const timeRangeLabel = style({
  fontFamily: '"TiemposText", serif',
  fontSize: '0.8rem',
  fontWeight: 400,
  padding: '0 0.512rem 0 0',
});

export const timeRangeInput = style({
  margin: 0,
  position: 'relative',
  top: '1px',
});
