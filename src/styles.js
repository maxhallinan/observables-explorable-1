import { style } from 'typestyle';

const remBase = 16;

const remToPx = (rem) => `${rem * remBase}px`;

export const explorable = style({
  display: 'block',
  height: '462.24px',
});

export const code = style({
  fontFamily: 'monospace',
  fontSize: remToPx(0.8),
});

export const controls = style({
  alignItems: 'center',
  display: 'flex',
});

export const controlItem = style({
  display: 'block',
});
