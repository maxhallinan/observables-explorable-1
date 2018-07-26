import { style } from 'typestyle';

import { remToPx } from './rem-to-px';

export const explorable = style({
  display: 'block',
  height: '536.24px',
});

export const code = style({
  fontFamily: 'Menlo, monospace',
  fontSize: remToPx(0.8),
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
