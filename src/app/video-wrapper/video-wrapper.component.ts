import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-video-wrapper',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit, AfterViewInit {

  @Input() config

  @ViewChild('videoElem') videoElemRef: ElementRef<HTMLVideoElement>;

  setupVideo(videoElem) {
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

  panLeft() {
    console.log("panned")
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setupVideo(this.videoElemRef.nativeElement)
  }

  
}
