import { DEFAULT_OPTIONS, CSS_VARS, CLASSES } from '../constants';
import KrouselError, { INVALID_TARGET } from '../errors';
import { htmlUtils, validators, debounce, pick, objectDiff } from '../utils';

import './Slider.scss';

const { isInstance, isInteger, isBoolean } = validators;

function getTarget(targetArg) {
  let result = targetArg;
  if (typeof targetArg === 'string') {
    result = document.getElementById(targetArg);
  } else if (isInstance(targetArg, HTMLElement)) {
    result = targetArg;
  } else {
    throw new KrouselError(INVALID_TARGET);
  }
  return result;
}

function mergeOptions(options) {
  let cleanOpts = Object.assign({}, options);
  // generic warn function
  const sendWarn = (optName, expected, actual) =>
    console.warn(
      `Krousel - Invalid option '${optName}' will be ignored. Expected ${expected}, got: ${actual}`,
    );
  // validate options
  const { appendDots } = options;
  if (appendDots && !isInstance(appendDots, HTMLElement)) {
    // erase option
    let actual =
      (appendDots.constructor && appendDots.constructor.name) ||
      (appendDots.prototype && appendDots.prototype.name) ||
      appendDots;
    sendWarn('appendDots', 'HTMLElement', actual);
    delete cleanOpts.appendDots;
  }

  // merge with defaults
  let resultConf = Object.assign({}, DEFAULT_OPTIONS, cleanOpts);

  if (resultConf.responsive) {
    // sort responsive configs by breakpoints size ASC
    resultConf.responsive.sort((a, b) => a.breakpoint - b.breakpoint);
  }

  return resultConf;
}

/**
 * Valid properties in responsive[*].settings
 * @type {string[]}
 */
const VALID_BP_PROPS = ['slidesToShow', 'slidesToScroll', 'infinite'];

/**
 * Compute which breakpoint config to use based on screen size
 * @param options
 * @return {null}
 */
function getBreakpointConfig(options) {
  const { responsive } = options;
  let bpConfig = null;
  if (responsive) {
    // find the relevant config
    for (let conf of responsive) {
      if (window.innerWidth <= conf.breakpoint) {
        // responsive is sorted by breakpoint size ASC
        // first match is the relevant one
        // we can stop here
        bpConfig = conf;
        break;
      }
    }
    if (bpConfig) {
      // keep only valid options
      bpConfig.settings = pick(bpConfig.settings, VALID_BP_PROPS);
    }
  }
  return bpConfig;
}

export default class Slider {
  constructor(target, options) {
    this._setupOptions = mergeOptions(options);
    this._target = getTarget(target);

    // init props
    this._initialized = false;
    this._currentPage = 0;

    this.showPrev = this.showPrev.bind(this);
    this.showNext = this.showNext.bind(this);
    this._enableTransition = this._enableTransition.bind(this);
    this._handleResize = this._handleResize.bind(this);

    this._computeOptions();
    this._computeProps();
    this._setupDOM();
    this._initialized = true;
  }

  _computeOptions() {
    let result = {};
    const bpConfig = getBreakpointConfig(this._setupOptions);
    if (bpConfig !== this._breakpoint) {
      const newOptions = Object.assign(
        {},
        this._setupOptions,
        bpConfig && bpConfig.settings,
      );

      if (this._options) {
        result = objectDiff(this._options, newOptions);
      }

      this._breakpoint = bpConfig;
      this._options = newOptions;
    }
    return result;
  }

  _setCssVar(name, value) {
    this._target.style.setProperty(name, value);
  }

  _computeProps() {
    const { infinite, slidesToShow, slidesToScroll } = this._options;
    if (!this._initialized) {
      this._slideCount = this._target.childElementCount;
    } else {
      const selector = `.${CLASSES.slide}:not(.${CLASSES.slideClone})`;
      this._slideCount = this._track.querySelectorAll(selector).length;
    }
    this._pageCount = Math.ceil(
      (this._slideCount + slidesToScroll - slidesToShow) / slidesToScroll,
    );
    // bound current page to page count
    this._currentPage = Math.min(this._currentPage, this._pageCount - 1);
    this._clonePerSide = infinite ? 2 * slidesToShow : 0;
  }

  /**
   * Setup DOM
   * @private
   */
  _setupDOM() {
    const { rtl, infinite } = this._options;

    const children = Array.from(this._target.children);

    this._target.classList.add(CLASSES.root);

    this._prevArrow = htmlUtils.createElement('div', {
      className: CLASSES.arrowLeft,
    });
    this._prevArrow.addEventListener('click', this.showPrev);
    this._nextArrow = htmlUtils.createElement('div', {
      className: CLASSES.arrowRight,
    });
    this._nextArrow.addEventListener('click', this.showNext);
    this._trackContainer = htmlUtils.createElement('div', {
      className: CLASSES.trackContainer,
    });

    htmlUtils.append(this._target, [
      rtl ? this._nextArrow : this._prevArrow,
      this._trackContainer,
      rtl ? this._prevArrow : this._nextArrow,
    ]);

    this._setupDotsDOM();

    this._setCssVar(CSS_VARS.slideDOMIndex, this._clonePerSide);

    this._track = htmlUtils.createElement('div', {
      className: CLASSES.track,
    });
    htmlUtils.append(this._trackContainer, this._track);
    this._computeSize();

    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.classList.add(CLASSES.slide);
        this._track.appendChild(child);
      }
    });

    if (infinite) {
      this._setupInfiniteDOM();
    }

    this._computeSlidesClasses(0);

    // defer activation of transitions to next repaint
    requestAnimationFrame(this._enableTransition);

    // setup listeners
    window.addEventListener('resize', debounce(this._handleResize, 50));
  }

  _setupInfiniteDOM() {
    const slides = Array.from(
      this._track.querySelectorAll(`.${CLASSES.slide}`),
    );
    const firstSlide = this._track.firstChild;
    let cloneList = slides;
    while (cloneList.length < this._clonePerSide) {
      cloneList = cloneList.concat(slides);
    }
    const clonesStart = cloneList.slice(-this._clonePerSide).map((child) => {
      const clone = child.cloneNode(true);
      clone.classList.add(CLASSES.slideClone);
      return clone;
    });
    cloneList.slice(0, this._clonePerSide).forEach((child) => {
      const clone = child.cloneNode(true);
      clone.classList.add(CLASSES.slideClone);
      this._track.appendChild(clone);
    });
    clonesStart.forEach((clone) => this._track.insertBefore(clone, firstSlide));
  }

  _setupDotsDOM() {
    const { appendDots, dots } = this._options;
    if (dots) {
      if (this._dots) {
        // remove existing DOM
        this._dots.remove();
      }
      // create each dot
      let dotsItems = new Array(this._pageCount)
        .fill(null)
        .map((__) =>
          htmlUtils.createElement('div', { className: CLASSES.dot }),
        );
      dotsItems.forEach((d, i) =>
        d.addEventListener('click', () => this._goToPage(i)),
      );
      this._dots = htmlUtils.createElement(
        'div',
        {
          className: CLASSES.dots,
        },
        dotsItems,
      );

      let container = appendDots || this._target;
      container.appendChild(this._dots);
    }
  }

  _handleResize() {
    const { responsive } = this._options;
    this._disableTransition();

    if (responsive) {
      const optionsChanged = this._computeOptions();
      this._computeProps();
      this._processOptionsChange(optionsChanged);
    }

    this._computeSize();

    if (responsive) {
      this._setupDotsDOM();
      this._goToPage(this._currentPage);
    }

    // defer activation of transitions to next repaint
    requestAnimationFrame(this._enableTransition);
  }

  _processOptionsChange(optionsChanged) {
    const { infinite } = this._options;

    const anyChanged = (props) =>
      props.some((x) => optionsChanged.hasOwnProperty(x));

    if (anyChanged(['infinite', 'slidesToShow'])) {
      // recompute infinite
      // destroy clones anyway
      this._track
        .querySelectorAll(`.${CLASSES.slideClone}`)
        .forEach((e) => e.remove());

      if (infinite) {
        // setup infinite
        this._setupInfiniteDOM();
      }
    }
  }

  /**
   * Revert changes made to the DOM upon destroy
   * @private
   */
  _cleanUpDOM() {
    // TODO
  }

  /**
   * Update all classes for a given slide display
   * @param slideIndex
   * @private
   */
  _computeSlidesClasses(slideIndex) {
    const { dots, slidesToShow } = this._options;
    const highlightIndex = [];
    for (let i = slideIndex; i < slideIndex + slidesToShow; i++) {
      const domIdx = i + this._clonePerSide;
      highlightIndex.push(domIdx);
      if (i < 0) {
        highlightIndex.push(domIdx + this._slideCount);
      } else if (i >= this._slideCount) {
        highlightIndex.push(domIdx - this._slideCount);
      }
    }

    this._track.querySelectorAll(`.${CLASSES.slide}`).forEach((item, i) => {
      if (highlightIndex.includes(i)) {
        item.classList.add(CLASSES.slideVisible);
      } else {
        item.classList.remove(CLASSES.slideVisible);
      }
    });

    // ARROWS
    this._computeArrowClasses();

    // DOTS
    if (dots) {
      const dotItems = this._dots.querySelectorAll(`.${CLASSES.dot}`);
      dotItems.forEach((item) => item.classList.remove(CLASSES.current));
      dotItems[this._currentPage].classList.add(CLASSES.current);
    }
  }

  _computeArrowClasses() {
    const { infinite } = this._options;
    if (!infinite) {
      if (this._currentPage === 0) {
        this._prevArrow.classList.add(CLASSES.arrowDisabled);
      } else {
        this._prevArrow.classList.remove(CLASSES.arrowDisabled);
      }
      if (this._currentPage === this._pageCount - 1) {
        this._nextArrow.classList.add(CLASSES.arrowDisabled);
      } else {
        this._nextArrow.classList.remove(CLASSES.arrowDisabled);
      }
    } else {
      this._prevArrow.classList.remove(CLASSES.arrowDisabled);
      this._nextArrow.classList.remove(CLASSES.arrowDisabled);
    }
  }

  _goToPage(pageIndex) {
    if (this.__goToPage_defer) {
      // execute immediately the deferred callback;
      this.__goToPage_defer();
      // re-process goto instruction before next render
      requestAnimationFrame(() => this._goToPage(pageIndex));
      return;
    }
    const { slidesToShow, slidesToScroll, speed } = this._options;

    let postProcess = false,
      finalPageIndex = pageIndex;
    if (pageIndex >= this._pageCount) {
      finalPageIndex = 0;
      postProcess = true;
    } else if (pageIndex < 0) {
      finalPageIndex = this._pageCount - 1;
      postProcess = true;
    }
    this._currentPage = finalPageIndex;
    let slideIndex;
    if (pageIndex >= this._pageCount) {
      slideIndex = this._slideCount;
    } else if (pageIndex < 0) {
      slideIndex = -slidesToShow;
    } else {
      slideIndex = pageIndex * slidesToScroll;
    }

    if (
      pageIndex === this._pageCount - 1 &&
      slideIndex > this._slideCount - slidesToShow
    ) {
      // last page might be incomplete if slideCount % slidesToShow != 0
      slideIndex = this._slideCount - slidesToShow;
    }

    // Clamp slideIndex to prevent going too far in clones
    slideIndex = Math.min(
      Math.max(slideIndex, -slidesToShow),
      this._slideCount,
    );

    // UPDATE CLASSES
    this._computeSlidesClasses(slideIndex);

    const slideDOMIndex = slideIndex + this._clonePerSide;
    this._setCssVar(CSS_VARS.slideDOMIndex, slideDOMIndex);
    if (postProcess) {
      this.__goToPage_defer = () => {
        delete this.__goToPage_defer;
        clearTimeout(this.__goToPage_timer);
        // teleport back to index within bounds (after sliding in clones)
        this._disableTransition();
        this._goToPage(finalPageIndex);
        requestAnimationFrame(this._enableTransition);
      };
      this.__goToPage_timer = setTimeout(this.__goToPage_defer, speed);
    }
  }

  _enableTransition() {
    const { speed } = this._options;
    this._track.style.transition = `transform ${speed}ms ease-in-out`;
  }

  _disableTransition() {
    this._track.style.transition = 'none';
  }

  _computeSize() {
    const { slidesToShow } = this._options;
    const cloneCount = 2 * this._clonePerSide;
    const sliderWidth = this._trackContainer.clientWidth;
    const slideWidth = sliderWidth / slidesToShow;
    this._setCssVar(CSS_VARS.slideWidth, slideWidth + 'px');
    this._track.style.width = `${(cloneCount + this._slideCount) * slideWidth +
      1000}px`;
  }

  showNext() {
    const { infinite } = this._options;
    if (infinite || this._currentPage < this._pageCount - 1) {
      this._goToPage(this._currentPage + 1);
    }
  }

  showPrev() {
    const { infinite } = this._options;
    if (infinite || this._currentPage > 0) {
      this._goToPage(this._currentPage - 1);
    }
  }
}
