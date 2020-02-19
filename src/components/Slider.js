import { DEFAULT_OPTIONS, CLASSES } from '../constants';
import KrouselError, { INVALID_TARGET } from '../errors';
import { htmlUtils } from '../utils';

function getTarget(targetArg) {
  let result = targetArg;
  if (typeof targetArg === 'string') {
    result = document.getElementById(targetArg);
  } else if (targetArg instanceof HTMLElement) {
    result = targetArg;
  } else {
    throw new KrouselError(INVALID_TARGET);
  }
  return result;
}

const posMod = (a, b) => ((a % b) + b) % b;

export default class Slider {
  constructor(target, options) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
    this._target = getTarget(target);
    this._setupDOM();
  }

  /**
   * Setup DOM
   * @private
   */
  _setupDOM() {
    const { rtl, slidesToShow, slidesToScroll, infinite } = this._options;

    const children = Array.from(this._target.children);

    this._slideCount = children.length;

    this._currentPage = 0;
    this._pageCount = Math.ceil(
      (this._slideCount + slidesToScroll - slidesToShow) / slidesToScroll,
    );

    this._target.classList.add(CLASSES.root);

    this._prevArrow = htmlUtils.createElement('div', {
      className: CLASSES.arrowLeft,
    });
    this._prevArrow.addEventListener('click', this.showPrev.bind(this));
    this._nextArrow = htmlUtils.createElement('div', {
      className: CLASSES.arrowRight,
    });
    this._nextArrow.addEventListener('click', this.showNext.bind(this));
    const trackContainer = htmlUtils.createElement('div', {
      className: CLASSES.trackContainer,
    });

    htmlUtils.append(this._target, [
      rtl ? this._nextArrow : this._prevArrow,
      trackContainer,
      rtl ? this._prevArrow : this._nextArrow,
    ]);

    // const clonePerSide = infinite
    //   ? Math.min(2 * slidesToShow, children.length)
    //   : 0;
    const clonePerSide = infinite ? 2 * slidesToShow : 0;
    this._clonePerSide = clonePerSide;
    const cloneCount = 2 * clonePerSide;
    const sliderWidth = trackContainer.clientWidth;
    this._slideWidth = sliderWidth / slidesToShow;

    this._track = htmlUtils.createElement('div', {
      className: CLASSES.track,
      style: htmlUtils.makeStyle({
        width: `${(cloneCount + this._slideCount) * this._slideWidth}px`,
        transform: `translate3d(${-clonePerSide * this._slideWidth}px,0,0)`,
      }),
    });
    htmlUtils.append(trackContainer, this._track);

    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.classList.add(CLASSES.slide);
        child.style.width = `${this._slideWidth}px`;
        this._track.appendChild(child);
      }
    });

    if (infinite) {
      const firstSlide = this._track.firstChild;
      let cloneList = children;
      while (cloneList.length < clonePerSide) {
        cloneList = cloneList.concat(children);
      }
      // let clonesStart =
      const clonesStart = cloneList.slice(-clonePerSide).map((child) => {
        const clone = child.cloneNode(true);
        clone.classList.add(CLASSES.slideClone);
        return clone;
      });
      cloneList.slice(0, clonePerSide).forEach((child) => {
        const clone = child.cloneNode(true);
        clone.classList.add(CLASSES.slideClone);
        this._track.appendChild(clone);
      });
      clonesStart.forEach((clone) =>
        this._track.insertBefore(clone, firstSlide),
      );
    }

    this._computeSlidesClasses(0);
  }

  /**
   * Revert changes made to the DOM upon destroy
   * @private
   */
  _cleanUpDOM() {}

  _computeSlidesClasses(slideIndex) {
    const { slidesToShow } = this._options;
    const slideDOMIndex = slideIndex + this._clonePerSide;
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

    const slides = this._track
      .querySelectorAll(`.${CLASSES.slide}`)
      .forEach((item, i) => {
        if (highlightIndex.includes(i)) {
          item.classList.add(CLASSES.slideVisible);
        } else {
          item.classList.remove(CLASSES.slideVisible);
        }
      });
  }

  _goToPage(pageIndex) {
    if (this.__goToPage_defer) {
      // execute immediately the deferred callback;
      this.__goToPage_defer();
      // re-process goto instruction before next render
      requestAnimationFrame(() => this._goToPage(pageIndex));
      return;
    }
    const { infinite, slidesToShow, slidesToScroll } = this._options;

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
    console.log('GOTO');
    console.log(`page index ${pageIndex} (${finalPageIndex})`);
    console.log('=> slide index', slideIndex);
    if (
      pageIndex === this._pageCount - 1 &&
      slideIndex > this._slideCount - slidesToShow
    ) {
      // if (
      //   slideIndex > this._slideCount - slidesToShow &&
      //   slideIndex < this._slideCount
      // ) {
      console.log('last one');
      // last page might be incomplete if slideCount % slidesToShow != 0
      slideIndex = this._slideCount - slidesToShow;
    }

    let pIdx = slideIndex;
    // Clamp slideIndex to prevent going too far in clones
    slideIndex = Math.min(
      Math.max(slideIndex, -slidesToShow),
      this._slideCount,
    );
    if (slideIndex !== pIdx) {
      console.log('got clamped', pIdx, '->', slideIndex);
    }

    // UPDATE CLASSES
    this._computeSlidesClasses(slideIndex);

    const slideDOMIndex = slideIndex + this._clonePerSide;
    const dX = slideDOMIndex * this._slideWidth;
    this._track.style.transform = `translate3d(${-dX}px, 0, 0)`;
    if (postProcess) {
      this.__goToPage_defer = () => {
        delete this.__goToPage_defer;
        clearTimeout(this.__goToPage_timer);
        // teleport back to index within bounds (after sliding in clones)
        this._disableTransition();
        this._goToPage(finalPageIndex);
        requestAnimationFrame(this._enableTransition.bind(this));
      };
      this.__goToPage_timer = setTimeout(this.__goToPage_defer, 300);
    }
  }

  _enableTransition() {
    this._track.classList.remove(CLASSES.noAnimation);
  }

  _disableTransition() {
    this._track.classList.add(CLASSES.noAnimation);
  }

  showNext() {
    this._goToPage(this._currentPage + 1);
  }

  showPrev() {
    this._goToPage(this._currentPage - 1);
  }
}
