import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import panzoom, { PanZoom, PanZoomOptions, TransformOrigin } from 'panzoom'

@Component({
  selector: 'app-video-wrapper',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit, AfterViewInit {

  @Input() config

  @ViewChild('videoElem') videoElemRef: ElementRef<HTMLVideoElement>;

  panzoom: PanZoom

  zoomLevel: number

  panzoomConfig: PanZoomOptions = {
    bounds: true,
  }

  MAX_ZOOM = 4
  MIN_ZOOM = 1

  showZoomTools: boolean = false;

  tranformOrigin: TransformOrigin;

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

  setupVideo(videoElem: HTMLVideoElement) {
    this.zoomLevel = 1
    this.tranformOrigin = {
      x: .5,
      y: .5
      // x: this.config.width/2, 
      // y: this.config.height/2 
    }
    let bounds = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    this.panzoom = panzoom(videoElem, {
      bounds: true,
      boundsPadding: 1,
      minZoom: this.MIN_ZOOM,
      maxZoom: this.MAX_ZOOM,
      onDoubleClick: function(e) {
        // `e` - is current double click event.
        console.log(e)
        return true; // tells the library to not preventDefault, and not stop propagation
      }
    })
    this.panzoom.on('panend', (e: PanZoom) => {
      const { x } = e.getTransform();
      const maxTranslate = videoElem.getBoundingClientRect().width - videoElem.clientWidth;
      
      if (Math.abs(x) >= maxTranslate) {
        e.moveBy(-(x + maxTranslate), 0, true);
      }
    });
    //this.panzoom.zoomAbs(this.tranformOrigin.x, this.tranformOrigin.y, this.zoomLevel)
    videoElem.autoplay = true;
    videoElem.muted = true
    videoElem.controls = false
  }

  getSize() {
    let height = this.config.height * .12
    if (height > 35) {
      return 'size=' + 35
    }
    return 'size=' + height
  }

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
    console.log("moved to x, y, z", this.tranformOrigin.x, this.tranformOrigin.y, this.zoomLevel)
  }


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setupVideo(this.videoElemRef.nativeElement)
  }

  
}
