import debounce from"./debounce.js"
export default class Slide {
  constructor(slide, slidewrapper) {
    this.slide = document.querySelector(slide);
    this.slidewrapper = document.querySelector(slidewrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "ativo";
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
    this.transition(false);
  }
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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
    this.changeSlideOnEnd();
    this.transition(true);
  }
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined)
      this.changeSlide(this.index.next);
    else if (this.dist.movement < -120 && this.index.prev !== undefined)
      this.changeSlide(this.index.prev);
    else this.changeSlide(this.index.active);
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
    this.changeActiveClass();
  }
  changeActiveClass() {
    this.slideArray.forEach((slide) => {
      slide.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }
  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }
  onResize() {
    console.log("teste");
    
    setTimeout(() => {
      this.slideconfig();
      this.changeSlide(this.index.active);
    }, 200)
  }
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 50);
  }
  init() {
    if (this.slide && this.slidewrapper) {
      this.bindEvents();
      this.addEventSlide();
      this.slideconfig();
      this.changeSlide(0)
      this.addResizeEvent();
    }
  }
}
