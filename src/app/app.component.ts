import { Component, ViewEncapsulation, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Input() config: any;

  parsedConfig$: Subject<any> = new Subject<any>()

  unsubscribe$: Subject<void> = new Subject<void>()

  constructor() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.parsedConfig$.next(JSON.parse(this.config))
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
