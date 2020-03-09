export const TRANSITION = {
  SLIDE: 'slide',
  FADE: 'fade',
};

export const DEFAULT_OPTIONS = {
  // Change where the navigation dots are attached
  appendDots: null,
  // Display or Hide dots
  dots: true,
  // Enable or disable infinite behavior
  infinite: true,
  // breakpoints config
  responsive: null,
  // Number of slide to show at once
  slidesToShow: 1,
  // Number of slide to scroll when clicking on arrow
  slidesToScroll: 1,
  // transition speed when changing slide
  speed: 300,

  autoplay: false, // TODO
  autoplaySpeed: 3000, // TODO
  arrows: true, // TODO
  draggable: true, // TODO
  transition: TRANSITION.SLIDE, // TODO
  pauseOnFocus: true, // TODO
  pauseOnHover: true, // TODO
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
};

export const CSS_VARS = {
  slideWidth: '--slide-width',
  slideDOMIndex: '--slide-didx',
};
