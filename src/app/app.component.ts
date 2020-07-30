import { Component, ViewEncapsulation, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements AfterViewInit, OnDestroy {
  
  /** The input config to be parsed from a JSON object */
  @Input() config: string;

  /** The video element to give to the container. */
  @Output() videoElementSetup: EventEmitter<HTMLVideoElement> = new EventEmitter<HTMLVideoElement>()

  /** The config that has been parsed from JSON */
  parsedConfig$: Subject<any> = new Subject<any>()

  unsubscribe$: Subject<void> = new Subject<void>()

  constructor() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.parsedConfig$.next(JSON.parse(this.config))
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
