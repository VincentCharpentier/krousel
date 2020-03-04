import './index.scss';

function makeLensSection(section) {
  if (section) {
    const trackContainer = document.querySelector('.k-track-container');

    function onMouseEnter(e) {
      const element = e.currentTarget;
      if (!element.classList.contains('k-slide-visible')) {
        return;
      }

      const visibleSlides = Array.from(
        trackContainer.querySelectorAll('.k-slide-visible'),
      );
      let idx = visibleSlides.indexOf(element);
      const isFirst = idx === 0;
      const isLast = idx === visibleSlides.length - 1;

      const parentClasses = ['stepBack'];
      if (isFirst) {
        parentClasses.push('firstFocused');
      } else if (isLast) {
        parentClasses.push('lastFocused');
      }

      trackContainer.classList.add(...parentClasses);
    }

    function onMouseOut(e) {
      const element = e.currentTarget;
      if (!element.contains(e.relatedTarget)) {
        trackContainer.classList.remove(
          ...['stepBack', 'firstFocused', 'lastFocused'],
        );
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
