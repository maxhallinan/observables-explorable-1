import * as Rx from 'rxjs'
import {Observable} from 'rxjs'
import {VNode} from '@cycle/dom'
import {DOMSource} from '@cycle/dom/rxjs-typings'

export type Sources = {
  DOM : DOMSource;
}

export type Sinks = {
  DOM : Observable<VNode>;
}

export type Component = (s : Sources) => Sinks;
