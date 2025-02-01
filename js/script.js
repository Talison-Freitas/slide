import SlideNav  from "./slide.js";

const slide = new SlideNav(".slide", ".slide-wrapper");

slide.init();
slide.addArrow(".arrow-nav .prev", ".arrow-nav .next");
slide.addControl(".custom-controls");
