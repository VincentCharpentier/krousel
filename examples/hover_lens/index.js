import './index.scss';

const factor = 0.25;
const halfFactor = factor / 2;

function makeLensSection(section) {
  if (section) {
    const trackContainer = document.querySelector('.k-track-container');

    function onMouseEnter(e) {
      const element = e.currentTarget;

      if (!element.classList.contains('k-slide-visible')) {
        return;
      }

      const visibles = Array.from(
        trackContainer.querySelectorAll('.k-slide-visible'),
      );
      let idx = visibles.indexOf(element);
      const isFirst = idx === 0;
      const isLast = idx === visibles.length - 1;

      const width = element.clientWidth;
      const effectW = width * halfFactor;

      element.style.marginLeft = element.style.marginRight = `${effectW}px`;

      let parentOffset = -effectW;
      if (isFirst) {
        parentOffset = 0;
      } else if (isLast) {
        parentOffset *= 2;
      }

      trackContainer.style.left = `${parentOffset}px`;
      const parent = element.parentElement;
      parent.classList.add('stepBack');
      // if (element !== parent.firstElementChild) {
      // }
    }
    function onMouseOut(e) {
      const element = e.currentTarget;
      if (!element.contains(e.relatedTarget)) {
        element.style.marginLeft = element.style.marginRight = '';
        trackContainer.style.left = '';
      }
    }

    // wrap every slide content
    section.querySelectorAll('.k-slide').forEach((slide) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('lens-wrapper');
      wrapper.append(...slide.childNodes);
      slide.appendChild(wrapper);

      slide.addEventListener('mouseenter', onMouseEnter);
      slide.addEventListener('mouseout', onMouseOut);
    });
  }
}
document.querySelectorAll('.lens').forEach(makeLensSection);
