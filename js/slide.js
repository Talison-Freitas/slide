import debounce from "./debounce.js";
export default class Slide {
  constructor(slide, slideWrapper) {
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "ativo";
    this.changeEvent = new Event("changeEvent");
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
    this.slideWrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
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
    this.slideWrapper.removeEventListener(moveType, this.onMove);
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
  addSlideEvents() {
    this.slideWrapper.addEventListener("mousedown", this.onStart);
    this.slideWrapper.addEventListener("touchstart", this.onStart);
    this.slideWrapper.addEventListener("mouseup", this.onEnd);
    this.slideWrapper.addEventListener("touchend", this.onEnd);
  }
  // Slide config
  slidePosition(slide) {
    const margin = (this.slideWrapper.offsetWidth - slide.offsetWidth) / 2;
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
    this.slideWrapper.dispatchEvent(this.changeEvent);
  }
  changeActiveClass() {
    this.slideArray.forEach((slide) => {
      slide.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }
  activePrevSlide(event) {
    if (this.index.prev !== undefined && event.target !== this.slideWrapper) {
      this.changeSlide(this.index.prev);
    }
  }
  activeNextSlide(event) {
    if (this.index.next !== undefined && event.target !== this.slideWrapper) {
      this.changeSlide(this.index.next);
    }
  }
  onResize() {
    setTimeout(() => {
      this.slideconfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }
  init() {
    if (this.slide && this.slideWrapper) {
      this.bindEvents();
      this.transition(true);
      this.addSlideEvents();
      this.slideconfig();
      this.addResizeEvent();
      this.changeSlide(0);
    }
  }
}
export class SlideNav extends Slide {
  constructor(slide, slideWrapper) {
    super(slide, slideWrapper);
    this.bindControlEvents();
  }
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }
  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide";
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index}">${index + 1}</a></li>`;
    });
    this.slideWrapper.insertBefore(control, this.slide.nextElementSibling);
    return control;
  }
  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.slideWrapper.addEventListener("changeEvent", this.activeControlItem);
  }
  activeControlItem() {
    this.controlArray.forEach((item) =>
      item.classList.remove(this.activeClass)
    );
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }
  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }
  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
