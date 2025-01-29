export default class Slide {
  constructor(slide, slidewrapper) {
    this.slide = document.querySelector(slide);
    this.slidewrapper = document.querySelector(slidewrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }
  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      event.preventDefault();
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.slidewrapper.addEventListener(moveType, this.onMove);
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
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }
  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.slidewrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  addEventSlide() {
    this.slidewrapper.addEventListener("mousedown", this.onStart);
    this.slidewrapper.addEventListener("touchstart", this.onStart);
    this.slidewrapper.addEventListener("mouseup", this.onEnd);
    this.slidewrapper.addEventListener("touchend", this.onEnd);
  }
  // Slide config
  slidePosition(slide) {
    const margin = (this.slidewrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }
  slideconfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { element, position };
    });
  }
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
  }
  init() {
    if (this.slide && this.slidewrapper) {
      this.bindEvents();
      this.addEventSlide();
      this.slideconfig();
    }
  }
}
