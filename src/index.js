import * as Rx from 'rxjs'
import {run} from '@cycle/rxjs-run'
import {makeDOMDriver} from '@cycle/dom'

import {App} from './app'

const main = App

window.ObservablesExplorable1 = {
  run: (appContainer) => {
    const drivers = {
      DOM: makeDOMDriver(appContainer)
    }

    run(main, drivers)
  },
};
