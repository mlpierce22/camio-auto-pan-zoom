import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import panzoom, { PanZoom, PanZoomOptions, TransformOrigin } from 'panzoom'

@Component({
  selector: 'app-video-wrapper',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit, AfterViewInit {

  /** The config passed from the JS */
  @Input() config

  /** The video element to give to the container. */
  @Output() videoElementSetup: EventEmitter<HTMLVideoElement> = new EventEmitter<HTMLVideoElement>()

  /** The video element from the dom. */
  @ViewChild('videoElem') videoElemRef: ElementRef<HTMLVideoElement>;

  /** The panzoom object. */
  panzoom: PanZoom

  /** The current zoomLevel as a float. */
  zoomLevel: number

  /** Defined minimum and maximum zoom levels. */
  MAX_ZOOM = 4
  MIN_ZOOM = 1

  /** The config for the panZoom */
  panzoomConfig: PanZoomOptions = {
    bounds: true,
    boundsPadding: 1,
    minZoom: this.MIN_ZOOM,
    maxZoom: this.MAX_ZOOM,
    onDoubleClick: function(e) {
      return true; // tells the library to not preventDefault, and not stop propagation
    }
  }

  showZoomTools: boolean = false;

  tranformOrigin: TransformOrigin;

  /** Function to determine whether the user is hovering over the video. */
  userOver(status: boolean) {
    if (status) {
      this.panzoom.resume()
      this.showZoomTools = true
    }
    else {
      this.panzoom.pause()
      this.showZoomTools = false
    }
  }

  /** Set up the video component with the panZoom config */
  setupVideo(videoElem: HTMLVideoElement) {
    this.zoomLevel = 1
    this.tranformOrigin = {
      x: .5,
      y: .5
    }
    this.panzoom = panzoom(videoElem, this.panzoomConfig)
    // Fix to make sure it stays in bounds but still allows zoom thanks to https://github.com/anvaka/panzoom/issues/33#issuecomment-498225590
    this.panzoom.on('panend', (e: PanZoom) => {
      const { x } = e.getTransform();
      const maxTranslate = videoElem.getBoundingClientRect().width - videoElem.clientWidth;
      
      if (Math.abs(x) >= maxTranslate) {
        e.moveBy(-(x + maxTranslate), 0, true);
      }
    });
    this.videoElementSetup.emit(videoElem)
  }


  /** Handle zoom by a specified parameter. */
  zoom(value: number) {
    this.zoomLevel = this.panzoom.getTransform().scale + value
    if (this.zoomLevel >= this.MAX_ZOOM) {
      this.panzoom.smoothZoomAbs(this.tranformOrigin.x, this.tranformOrigin.y, this.MAX_ZOOM)
      this.zoomLevel = this.MAX_ZOOM
    } else if (this.zoomLevel <= this.MIN_ZOOM) {
      this.panzoom.smoothZoomAbs(this.tranformOrigin.x, this.tranformOrigin.y, this.MIN_ZOOM)
      this.zoomLevel = this.MIN_ZOOM
    } else {
      this.panzoom.smoothZoomAbs(this.tranformOrigin.x, this.tranformOrigin.y, this.zoomLevel)
    }
  }
  /** Get the size of the video object from the config with units. */
  getVideoDimensions() {
    return {
      width: this.config.width + this.config.units + '',
      height: this.config.height + this.config.units + ''
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Need to wait for the videoElement to be attached.
    this.setupVideo(this.videoElemRef.nativeElement)
  }

  
}
