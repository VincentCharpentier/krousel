export const TRANSITION = {
  SLIDE: 'slide',
  FADE: 'fade',
};

export const DEFAULT_OPTIONS = {
  // Change where arrows are attached (default is the target)
  appendArrows: null,
  // Change where the navigation dots are attached
  appendDots: null,
  // enable or disable arrows
  arrows: true,
  // Auto play the carousel
  autoplay: false,
  // Change the interval at which autoplay change slide
  autoplaySpeed: 3000,
  // Display or Hide dots
  dots: true,
  // Enable or disable infinite behavior
  infinite: true,
  // Customize the "next" arrow
  nextArrow: null,
  // pause autoplay when a slide is hovered,
  pauseOnHover: true,
  // Customize the "previous" arrow
  prevArrow: null,
  // breakpoints config
  responsive: null,
  // Number of slide to show at once
  slidesToShow: 1,
  // Number of slide to scroll when clicking on arrow
  slidesToScroll: 1,
  // transition speed when changing slide
  speed: 300,
  // Change transition type when changing slide
  // NOTE: transition 'fade' disable options slidesToShow and slidesToScroll
  transition: TRANSITION.SLIDE,

  // Enable dragging the slider track with touch or mouse
  draggable: true, // TODO
  rtl: false, // TODO
};

export const CLASSES = {
  root: 'krousel',
  trackContainer: 'k-track-container',
  track: 'k-track',
  slide: 'k-slide',
  slideClone: 'k-slide-cloned',
  slideVisible: 'k-slide-visible',
  arrowLeft: 'k-arrow-left',
  arrowRight: 'k-arrow-right',
  arrowDisabled: 'k-arrow-disabled',
  dots: 'k-dots',
  dot: 'k-dot',
  current: 'k-current',
  noTransition: 'k-no-transition',
  transitionSlide: 'k-tr-slide',
  transitionFade: 'k-tr-fade',
};

export const CSS_VARS = {
  slideWidth: '--slide-width',
  slideDOMIndex: '--slide-didx',
};
