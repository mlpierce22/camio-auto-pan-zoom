import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { VideoWrapperComponent } from './video-wrapper/video-wrapper.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    VideoWrapperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule
  ],
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule { 
  constructor(private inject: Injector) {
  }
  ngDoBootstrap() {
    const panZoom = createCustomElement(AppComponent, { injector: this.inject });
    if (!customElements.get('pan-zoom')) {
      customElements.define('pan-zoom', panZoom);
    } else {
      console.warn("stream-component declared multiple times")
    }
  }
}
