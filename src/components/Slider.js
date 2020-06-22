import { DEFAULT_OPTIONS, CSS_VARS, CLASSES, TRANSITION } from '../constants';
import KrouselError, { INVALID_TARGET } from '../errors';
import {
  htmlUtils,
  validators,
  debounce,
  pick,
  objectDiff,
  classNames,
} from '../utils';

import './Slider.scss';

const TRANSITION_CLASS = {
  [TRANSITION.SLIDE]: CLASSES.transitionSlide,
  [TRANSITION.FADE]: CLASSES.transitionFade,
};

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

const VALID_TRANSITIONS = Object.values(TRANSITION);
function mergeOptions(options) {
  let cleanOpts = Object.assign({}, options);
  // generic warn function
  const sendWarn = (optName, expected, actual) =>
    console.warn(
      `Krousel - Invalid option '${optName}' will be ignored. Expected ${expected}, got: ${actual}`,
    );
  // validate options
  const { appendDots, transition } = options;
  if (appendDots && !isInstance(appendDots, HTMLElement)) {
    // erase option
    let actual =
      (appendDots.constructor && appendDots.constructor.name) ||
      (appendDots.prototype && appendDots.prototype.name) ||
      appendDots;
    sendWarn('appendDots', 'HTMLElement', actual);
    delete cleanOpts.appendDots;
  }

  if (transition && !VALID_TRANSITIONS.includes(transition)) {
    sendWarn('transition', `oneOf ${VALID_TRANSITIONS.join('|')}`, transition);
    delete cleanOpts.transition;
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

/**
 * compute X position of a touch or mouse event
 * @param e native event
 * @return {number}
 */
function getEventClientX(e) {
  let result = 0;
  if (e.touches) {
    // touch event
    if (e.type === 'touchend') {
      result = e.changedTouches[0].clientX;
    } else {
      result = e.touches[0].clientX;
    }
  } else {
    result = e.clientX;
  }
  return result;
}

function cancelEvent(e) {
  e.preventDefault();
}

export default class Slider {
  constructor(target, options) {
    this._setupOptions = mergeOptions(options);
    this._target = getTarget(target);

    // init props
    this._initialized = false;
    this._currentPage = 0;
    this._dragInitialOffset = 0;

    this._showPrev = this._showPrev.bind(this);
    this._showNext = this._showNext.bind(this);
    this._enableTransition = this._enableTransition.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._stopAutoplay = this._stopAutoplay.bind(this);
    this._startAutoplay = this._startAutoplay.bind(this);
    this._resumeAutoplay = this._resumeAutoplay.bind(this);
    this._pauseAutoplay = this._pauseAutoplay.bind(this);
    this._doAutoplay = this._doAutoplay.bind(this);
    this._requestNext = this._requestNext.bind(this);
    this._requestPrev = this._requestPrev.bind(this);
    this._requestGoTo = this._requestGoTo.bind(this);
    this._startDragging = this._startDragging.bind(this);
    this._onDragMouseMove = this._onDragMouseMove.bind(this);
    this._endDragging = this._endDragging.bind(this);
    this._handleClickOnSlide = this._handleClickOnSlide.bind(this);

    this._computeOptions();
    this._computeProps();
    this._setupDOM();
    this._initialized = true;
    this._startAutoplay();
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
    const {
      infinite,
      slidesToShow,
      slidesToScroll,
      transition,
    } = this._options;
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
    this._hasClones = infinite && transition === TRANSITION.SLIDE;
    this._clonePerSide = this._hasClones ? 2 * slidesToShow : 0;
  }

  /**
   * Setup DOM
   * @private
   */
  _setupDOM() {
    const { transition, speed } = this._options;

    const children = Array.from(this._target.children);

    this._target.classList.add(CLASSES.root);

    this._track = htmlUtils.createElement('div', {
      className: classNames(CLASSES.track, TRANSITION_CLASS[transition]),
      style: htmlUtils.makeStyle({
        transitionDuration: `${speed}ms`,
      }),
    });
    this._disableTransition();

    this._trackContainer = htmlUtils.createElement(
      'div',
      {
        className: CLASSES.trackContainer,
      },
      this._track,
    );

    this._target.appendChild(this._trackContainer);

    this._setupArrowsDOM();
    this._setupDotsDOM();

    this._setCssVar(CSS_VARS.slideDOMIndex, this._clonePerSide);

    this._computeSize();

    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.classList.add(CLASSES.slide);
        this._track.appendChild(child);
      }
    });

    if (this._hasClones) {
      this._setupInfiniteDOM();
    }

    this._computeSlidesClasses(0);

    // force reflow before activating transitions
    this.__forceReflow();
    this._enableTransition();

    // setup listeners
    this._setupListeners();
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

  _setupArrowsDOM() {
    const {
      _forceAppendPrevArrow,
      _forceAppendNextArrow,
      appendArrows,
      arrows,
      nextArrow,
      prevArrow,
    } = this._options;
    if (arrows) {
      this._prevArrow = prevArrow || htmlUtils.createElement('div');
      this._prevArrow.classList.add(CLASSES.arrowLeft);
      this._nextArrow = nextArrow || htmlUtils.createElement('div');
      this._nextArrow.classList.add(CLASSES.arrowRight);
      let insertTarget = appendArrows || this._trackContainer;
      // append prevArrow if appendArrow is specified or if it was not already connected to DOM
      if (_forceAppendPrevArrow || !this._prevArrow.isConnected) {
        // append at first position
        if (insertTarget.childElementCount > 0) {
          insertTarget.insertBefore(this._prevArrow, insertTarget.firstChild);
        } else {
          insertTarget.appendChild(this._prevArrow);
        }
      }

      // append nextArrow if appendArrow is specified or if it was not already connected to DOM
      if (_forceAppendNextArrow || !this._nextArrow.isConnected) {
        // append at last position
        insertTarget.appendChild(this._nextArrow);
      }
    }
  }

  _setupDotsDOM() {
    const { appendDots, dots } = this._options;
    if (dots) {
      if (this._dots) {
        // remove existing DOM
        this._dots.remove();
      }
      // create each dot
      const dotsItems = new Array(this._pageCount)
        .fill(null)
        .map((__) =>
          htmlUtils.createElement('div', { className: CLASSES.dot }),
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

  _setupListeners() {
    const { arrows, dots, autoplay, pauseOnHover, swipe } = this._options;
    window.addEventListener('resize', debounce(this._handleResize, 100));
    this._track.querySelectorAll(`.${CLASSES.slide}`).forEach((element) =>
      element.addEventListener('click', this._handleClickOnSlide, {
        capture: true,
      }),
    );
    if (arrows) {
      this._prevArrow.addEventListener('click', this._requestPrev);
      this._nextArrow.addEventListener('click', this._requestNext);
    }
    if (dots) {
      this._dots
        .querySelectorAll(`.${CLASSES.dot}`)
        .forEach((d, i) =>
          d.addEventListener('click', () => this._requestGoTo(i)),
        );
    }
    if (autoplay) {
      let slides = this._track.querySelectorAll(`.${CLASSES.slide}`);
      const handleMouseOut = (e) => {
        const doStart = !e.currentTarget.contains(e.relatedTarget);
        if (doStart) {
          this._resumeAutoplay();
        }
      };
      if (pauseOnHover) {
        slides.forEach((slide) => {
          slide.addEventListener('mouseenter', this._pauseAutoplay);
          slide.addEventListener('mouseout', handleMouseOut);
        });
      }
    }
    if (swipe) {
      const onStopDrag = (e) => {
        window.removeEventListener('mousemove', this._onDragMouseMove);
        window.removeEventListener('touchmove', this._onDragMouseMove);
        window.removeEventListener('mouseup', onStopDrag);
        window.removeEventListener('touchend', onStopDrag);
        this._track
          .querySelectorAll(`.${CLASSES.slide}`)
          .forEach((element) =>
            element.removeEventListener('dragstart', cancelEvent),
          );
        this._endDragging(e);
      };
      const onStartDrag = (e) => {
        window.addEventListener('mouseup', onStopDrag);
        window.addEventListener('touchend', onStopDrag);
        window.addEventListener('mousemove', this._onDragMouseMove);
        window.addEventListener('touchmove', this._onDragMouseMove);
        this._track
          .querySelectorAll(`.${CLASSES.slide}`)
          .forEach((element) =>
            element.addEventListener('dragstart', cancelEvent),
          );

        this._startDragging(e);
      };
      this._track.addEventListener('mousedown', onStartDrag);
      this._track.addEventListener('touchstart', onStartDrag);
    }
  }

  _handleClickOnSlide(e) {
    if (this._isDragging) {
      cancelEvent(e);
      this._isDragging = false;
    }
  }

  _computeSlideIdxFromDragX(x) {
    const { transition, slidesToShow } = this._options;
    let result = Math.round(-x / this._slideWidth - this._clonePerSide);
    if (transition !== TRANSITION.SLIDE) {
      // fade transition: result is how many slides were swiped
      // add current slide index
      result += this._currentPage * slidesToShow;
    }
    return result;
  }

  _computeDragAmplitude(e) {
    const clientX = getEventClientX(e);
    return clientX - this._dragStartX;
  }

  _computeDragX(dragAmplitude) {
    const { infinite } = this._options;
    let finalX = this._dragInitialOffset + dragAmplitude;
    if (!infinite) {
      // limit drag effect in finite slider
      const minBound = -this._slideWidth * (this._slideCount - 1);
      finalX = Math.min(Math.max(finalX, minBound), 0);
    }
    return finalX;
  }

  _startDragging(e) {
    const { transition } = this._options;
    const isAnimSliding = transition === TRANSITION.SLIDE;
    this._dragStartX = getEventClientX(e);
    this._dragStartTime = Date.now();
    this._dragInitialOffset = isAnimSliding
      ? htmlUtils.getElementTranslateXValue(this._track)
      : 0;
    this._pauseAutoplay();
    if (isAnimSliding) {
      this._disableTransition();
    }
  }

  _onDragMouseMove(e) {
    const { transition } = this._options;
    const amplitude = this._computeDragAmplitude(e);
    if (!this._isDragging && Math.abs(amplitude) > 50) {
      // this will disable click on slides until drag is over
      this._isDragging = true;
    }
    const dragX = this._computeDragX(amplitude);
    if (transition === TRANSITION.SLIDE) {
      // make track follow input
      this._track.style.setProperty('--dX', dragX + 'px');
    }
    // update slide display according to drag position
    const currentSlideIdx = this._computeSlideIdxFromDragX(dragX);
    this._computeSlidesClasses(currentSlideIdx);
  }

  _endDragging(e) {
    const { slidesToScroll, slidesToShow, infinite } = this._options;
    const amplitude = this._computeDragAmplitude(e);
    const dragX = this._computeDragX(amplitude);
    // do not immediately update state, we could have a click to cancel after the mouseup event
    setTimeout(() => {
      this._isDragging = false;
    }, 250);

    // re-enable transition
    this._enableTransition();

    // remove css var overwrite
    this._track.style.removeProperty('--dX');

    // snap to closest page
    const slideIndex = this._computeSlideIdxFromDragX(dragX);
    let pageIndex = Math.round(slideIndex / slidesToScroll);

    if (pageIndex === this._currentPage) {
      // check if gesture was a quick slide
      const dragTime = Date.now() - this._dragStartTime;
      const absAmplitude = Math.abs(amplitude);
      const trackWidth = slidesToShow * this._slideWidth;
      // quick drag with reasonable amplitude is considered swipe next/prev
      if (
        dragTime < 500 &&
        absAmplitude > trackWidth * 0.3 &&
        absAmplitude < trackWidth
      ) {
        pageIndex = this._currentPage - Math.sign(amplitude);
      }
    }
    if (!infinite) {
      pageIndex = Math.min(Math.max(0, pageIndex), this._pageCount - 1);
    }
    this._goToPage(pageIndex);
    this._resumeAutoplay();
  }

  _startAutoplay() {
    const { autoplay } = this._options;
    if (autoplay) {
      this._apStopped = false;
      this._resumeAutoplay();
    }
  }

  _pauseAutoplay() {
    clearTimeout(this._autoplayTimer);
  }

  _resumeAutoplay() {
    const { autoplay, autoplaySpeed } = this._options;
    if (autoplay && !this._apStopped) {
      // make sure we were stopped
      clearTimeout(this._autoplayTimer);
      this._autoplayTimer = setTimeout(this._doAutoplay, autoplaySpeed);
    }
  }

  _stopAutoplay() {
    this._apStopped = true;
    this._pauseAutoplay();
  }

  _doAutoplay() {
    const { speed, autoplaySpeed } = this._options;
    this._showNext();
    this._autoplayTimer = setTimeout(this._doAutoplay, autoplaySpeed + speed);
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

    // force reflow before re-activating transitions
    this.__forceReflow();
    this._enableTransition();
  }

  _processOptionsChange(optionsChanged) {
    const anyChanged = (props) =>
      props.some((x) => optionsChanged.hasOwnProperty(x));

    if (anyChanged(['infinite', 'slidesToShow'])) {
      // recompute infinite
      // destroy clones anyway
      this._track
        .querySelectorAll(`.${CLASSES.slideClone}`)
        .forEach((e) => e.remove());

      if (this._hasClones) {
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
      if (dotItems.length > 0) {
        dotItems[this._currentPage].classList.add(CLASSES.current);
      }
    }
  }

  _computeArrowClasses() {
    const { arrows, infinite } = this._options;
    if (arrows) {
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
  }

  _goToPage(pageIndex) {
    // if a goto postprocess were deferred
    if (this.__goToPage_defer) {
      // execute immediately the deferred callback
      this.__goToPage_defer();
      // re-process goto instruction before next render
      this._goToPage(pageIndex);
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
      // The defered callback occured when we transition to a clone slide
      // it will translate to the original slide without transition
      this.__goToPage_defer = () => {
        delete this.__goToPage_defer;
        clearTimeout(this.__goToPage_timer);
        // teleport back to index within bounds (after sliding in clones)
        this._disableTransition();
        this._goToPage(finalPageIndex);
        // Trigger a reflow, flushing the CSS changes
        this.__forceReflow();
        // Re-enable CSS after reflow
        this._enableTransition();
      };
      // execute after the transition is complete
      this.__goToPage_timer = setTimeout(this.__goToPage_defer, speed);
    }
  }

  /**
   * Force browser to trigger a reflow
   * Useful after CSS changes and before (re)enabling transitions
   * @private
   */
  __forceReflow() {
    // value must be read to avoid browser optimizations that would skip useless reflow
    this._reflowTrash = this._track.offsetHeight; // DO NOT REMOVE
  }

  _enableTransition() {
    this._track.classList.remove(CLASSES.noTransition);
  }

  _disableTransition() {
    this._track.classList.add(CLASSES.noTransition);
  }

  _computeSize() {
    const { slidesToShow, transition } = this._options;
    const cloneCount = 2 * this._clonePerSide;
    const sliderWidth = this._trackContainer.clientWidth;
    this._slideWidth = sliderWidth / slidesToShow;
    this._setCssVar(CSS_VARS.slideWidth, this._slideWidth + 'px');
    if (transition === TRANSITION.SLIDE) {
      this._track.style.width = `${(cloneCount + this._slideCount) *
        this._slideWidth +
        1000}px`;
    }
  }

  _showNext() {
    const { infinite } = this._options;
    if (infinite || this._currentPage < this._pageCount - 1) {
      this._goToPage(this._currentPage + 1);
    }
  }

  _showPrev() {
    const { infinite } = this._options;
    if (infinite || this._currentPage > 0) {
      this._goToPage(this._currentPage - 1);
    }
  }

  /**
   * User request to show next slide
   * @private
   */
  _requestNext() {
    this._stopAutoplay();
    this._showNext();
  }

  /**
   * User request to show prev slide
   * @private
   */
  _requestPrev() {
    this._stopAutoplay();
    this._showPrev();
  }

  /**
   * User request to show a specific slide
   * @param index
   * @private
   */
  _requestGoTo(index) {
    this._stopAutoplay();
    this._goToPage(index);
  }
}
