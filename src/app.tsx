import * as Rx from 'rxjs'
import {Sources, Sinks} from './interfaces'

export function App(sources : Sources) : Sinks {
  const vtree$ = Rx.Observable.of(
    <div>My Awesome Cycle.js app</div>
  )

  return {
    DOM: vtree$
  }
}
