export default class Slide {
  constructor(slide, slidewrapper) {
    this.slide = document.querySelector(slide);
    this.slidewrapper = document.querySelector(slidewrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }
  onStart(event) {
    event.preventDefault();
    this.slidewrapper.addEventListener("mousemove", this.onMove);
    this.dist.startX = event.clientX;
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }
  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }
  onEnd() {
    this.slidewrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  addEventSlide() {
    this.slidewrapper.addEventListener("mousedown", this.onStart);
    this.slidewrapper.addEventListener("mouseup", this.onEnd);
  }
  init() {
    if (this.slide && this.slidewrapper) {
      this.bindEvents();
      this.addEventSlide();
    }
  }
}
