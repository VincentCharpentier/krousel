export const DEFAULT_OPTIONS = {
  dots: true, // TODO
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 300,

  // Change where the navigation dots are attached
  appendDots: null, // TODO
  autoplay: false, // TODO
  autoplaySpeed: 3000, // TODO
  arrows: true, // TODO
  draggable: true, // TODO
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
