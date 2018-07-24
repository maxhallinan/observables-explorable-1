#!/usr/bin/env bash
npm run build

s3cmd sync \
  --acl-public \
  --no-preserve \
  --add-header="Cache-Control:public, max-age=604800" \
  --mime-type="application/javascript" \
  ./build/bundle.js s3://static.maxhallinan.com/observables-explorable-1.js
