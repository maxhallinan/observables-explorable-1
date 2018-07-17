import * as Rx from 'rxjs'
import {Observable} from 'rxjs'
import {DOMSource, VNode} from '@cycle/dom'

export type Sources = {
  DOM : DOMSource;
}

export type Sinks = {
  DOM : Observable<VNode>;
}

export type Component = (s : Sources) => Sinks;
