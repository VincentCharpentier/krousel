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
    const { dots, rtl, slidesToShow, slidesToScroll, infinite } = this._options;

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

    let targetChildren = [
      rtl ? this._nextArrow : this._prevArrow,
      trackContainer,
      rtl ? this._prevArrow : this._nextArrow,
    ];

    if (dots) {
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
      targetChildren.push(this._dots);
    }

    htmlUtils.append(this._target, targetChildren);

    const clonePerSide = infinite ? 2 * slidesToShow : 0;
    this._clonePerSide = clonePerSide;
    const cloneCount = 2 * clonePerSide;
    const sliderWidth = trackContainer.clientWidth;
    this._slideWidth = sliderWidth / slidesToShow;

    this._track = htmlUtils.createElement('div', {
      className: CLASSES.track,
      style: htmlUtils.makeStyle({
        width: `${(cloneCount + this._slideCount) * this._slideWidth + 1000}px`,
        transform: `translate3d(${-clonePerSide * this._slideWidth}px,0,0)`,
      }),
    });
    htmlUtils.append(trackContainer, this._track);
    this._enableTransition();

    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.classList.add(CLASSES.slide);
        child.style = htmlUtils.makeStyle({
          width: `${this._slideWidth}px`,
        });
        this._track.appendChild(child);
      }
    });

    if (infinite) {
      const firstSlide = this._track.firstChild;
      let cloneList = children;
      while (cloneList.length < clonePerSide) {
        cloneList = cloneList.concat(children);
      }
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
    const { dots, infinite, slidesToShow } = this._options;
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
    }

    // DOTS
    if (dots) {
      const dotItems = this._dots.querySelectorAll(`.${CLASSES.dot}`);
      dotItems.forEach((item) => item.classList.remove(CLASSES.current));
      dotItems[this._currentPage].classList.add(CLASSES.current);
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
