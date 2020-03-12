import Krousel from '../dist/krousel';

function makeKrousel({ count = 5, name = '', className, ...config }) {
  let section = document.createElement('section');
  if (className) {
    section.classList.add(className);
  }
  let sectionTitle = document.createElement('h1');
  sectionTitle.innerHTML = name;
  section.appendChild(sectionTitle);
  let configDesc = document.createElement('pre');
  configDesc.innerHTML = JSON.stringify(
    config,
    (key, value) => {
      if (value instanceof HTMLElement) {
        return value.constructor.name;
      }
      return value;
    },
    2,
  );
  section.appendChild(configDesc);
  let target = document.createElement('div');
  section.appendChild(target);
  new Array(count).fill(null).forEach((__, i) => {
    let slide = document.createElement('div');
    let title = document.createElement('h3');
    title.innerHTML = (i + 1).toString();
    const color = Math.round((i / count) * 360);
    title.style.backgroundColor = `hsl(${color}, 60%, 60%)`;
    slide.appendChild(title);
    target.append(slide);
  });
  document.getElementById('target').appendChild(section);
  new Krousel(target, config);
}

const CONFIGS = [
  {
    name: 'Simple demo',
    count: 5,
    infinite: false,
  },
  {
    name: 'Infinite loop (default)',
    count: 5,
    infinite: true,
  },
  {
    name: 'Transition speed',
    count: 5,
    speed: 1000,
    className: 'slow',
  },
  {
    name: 'Transition Type',
    count: 5,
    transition: 'fade',
  },
  {
    name: 'Autoplay (pause when hovered)',
    count: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    infinite: true,
  },
  {
    name: 'Disable arrows',
    count: 5,
    arrows: false,
    autoplay: true,
  },
  {
    name: 'Show multiple',
    count: 5,
    slidesToShow: 2,
  },
  {
    name: 'Scroll multiple',
    count: 5,
    slidesToShow: 2,
    slidesToScroll: 2,
  },
  {
    name: 'Scroll multiple',
    count: 25,
    slidesToShow: 4,
    slidesToScroll: 3,
  },
  {
    name: 'Hide dots',
    count: 5,
    dots: false,
  },
  {
    name: 'Responsive',
    count: 10,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  },
];

window.addEventListener('load', function() {
  CONFIGS.map(makeKrousel);
  let section = document.getElementById('hoverEffect');
  new Krousel(section.querySelector('.slider'), {
    slidesToShow: 3,
  });

  // do krousel with custom inserts
  section = document.getElementById('customTargets');
  section.querySelector('pre').innerHTML = `{
  appendDots: HTMLElement
  appendArrows: HTMLElement
}`;
  new Krousel(section.querySelector('.slider'), {
    appendDots: section.querySelector('.top-zone'),
    appendArrows: section.querySelector('.top-zone'),
  });

  section = document.getElementById('customArrows');
  section.querySelector('pre').innerHTML = `{
  prevArrow: HTMLElement
  nextArrow: HTMLElement
}`;
  new Krousel(section.querySelector('.slider'), {
    prevArrow: section.querySelector('.go-prev'),
    nextArrow: section.querySelector('.go-next'),
  });
});
