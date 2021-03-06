import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import panzoom, { PanZoom, PanZoomOptions, TransformOrigin } from 'panzoom'
import { Config } from 'src/app/models'

@Component({
  selector: 'app-video-wrapper',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit, AfterViewInit {

  /** The config passed from the JS */
  @Input() config: Config;

  /** The video element to give to the container. */
  @Output() videoElementSetup: EventEmitter<HTMLVideoElement> = new EventEmitter<HTMLVideoElement>()

  /** The video element from the dom. */
  @ViewChild('videoElem') videoElemRef: ElementRef<HTMLVideoElement>;

  /** The progress bar from the dom. */
  @ViewChild('progressBar') progressBar: ElementRef<HTMLDivElement>;

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

  videoPlaying = false;

  showZoomTools: boolean = false;

  tranformOrigin: TransformOrigin;

  urlMetaData;

  totalVideoDuration = 0;

  progressPercent = 0;

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
    videoElem.controls = false;
    videoElem.autoplay = true;
    videoElem.muted = true;
    
    let activeVideo = 0;
    let videoUrlOptions = this.config.videoUrls;
    let baseVideoCount = 0;
    let activeVideoDuration = 0
    videoElem.src = videoUrlOptions[activeVideo];
    
    // thanks to https://stackoverflow.com/a/32343119, for the loop idea
    videoElem.addEventListener('ended', (e) => {
      activeVideoDuration = e["path"][0].duration;
      
      // update the new active video index
      activeVideo = (++activeVideo) % videoUrlOptions.length;

      if (activeVideo == 0) {
        // we started over, reset to 0, else, update the base to include the last video length
        baseVideoCount = 0;
      } else {
        baseVideoCount += activeVideoDuration;
      }

      // update the video source and play
      videoElem.src = videoUrlOptions[activeVideo];
      videoElem.play();
    });

    videoElem.addEventListener("timeupdate", (e) => {
      this.progressPercent = Math.floor((videoElem.currentTime + baseVideoCount) / this.totalVideoDuration * 100)
    })

    this.progressBar.nativeElement.addEventListener("click", (e) => {
      let parentRect = this.progressBar.nativeElement.getBoundingClientRect();

      const fillRect = e["path"][0].getBoundingClientRect();
      const totalWidth = parentRect.y - parentRect.x
      //const fillLength = rect.width;
      console.log(totalWidth, e.offsetX)
      const newWidthPercent = Math.floor(e.offsetX / totalWidth * 100);
      console.log(newWidthPercent)

     // const percentage = ( totalLeft / width );
      //const timeToGoTo = percentage * this.totalVideoDuration
      // if (0 <= baseVideoCount) {

      // } else if (timeToGoTo >= videoElem.duration) {


      // } else {
      //   console.log("time, vase", timeToGoTo, baseVideoCount)
      //   videoElem.currentTime = timeToGoTo - baseVideoCount
      // }
    })

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

  togglePlay() {
    const video = this.videoElemRef.nativeElement
    if(video.paused) {
      video.play();
      this.videoPlaying = false;
    } else {
      video.pause()
      this.videoPlaying = true;
    }
  }

  getTotalTime() {
    for (let i = 0; i < this.config.videoUrls.length; i++) {
      const video = document.createElement("video")
      video.src = this.config.videoUrls[i];
      video.load()
      video.onloadedmetadata = (e) => {
        this.totalVideoDuration += e["path"][0].duration
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.getTotalTime();
  }

  ngAfterViewInit(): void {
    // Need to wait for the videoElement to be attached.
    this.setupVideo(this.videoElemRef.nativeElement)
  }

  
}
