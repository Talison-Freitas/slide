export default class Slide {
  constructor(slide, slidewrapper) {
    this.slide = document.querySelector(slide);
    this.slidewrapper = document.querySelector(slidewrapper);
  }
  onStart(event) {
    event.preventDefault();
    this.slidewrapper.addEventListener("mousemove", this.onMove);
  }
  onMove() {
  }
  onEnd() {
    this.slidewrapper.removeEventListener("mousemove", this.onMove);
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  addEventSlide() {
    this.slidewrapper.addEventListener("mousedown", this.onStart);
    this.slidewrapper.addEventListener("mouseup", this.onEnd)
  }
  init() {
    if (this.slide && this.slidewrapper) {
      this.bindEvents();
      this.addEventSlide();
    }
  }
}