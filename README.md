[![NPM Version](https://img.shields.io/npm/v/krousel.svg?style=flat)](https://www.npmjs.com/package/krousel)

# krousel

Carousel library with vanilla Javascript

[Check the demo here](https://vincentcharpentier.github.io/krousel/)

Disclaimer: This library is inspired by [Slick](https://github.com/kenwheeler/slick) which is a jQuery plugin. The goal is to provide a similar utility without the jQuery dependency. The API here is almost the same as slick's one. 

## Installation

```bash
npm install --save krousel
```

## Features

- Infinite loop
- Change transition speed & type (slide / fade)
- Autoplay & autoplay speed
- Enable / Disable arrows
- Enable / Disable navigation dots
- Show multiple slides at once
- Slide multiple slides at once
- Responsive: change config using breakpoints
- Change where dots and/or arrows will be inserted
- Use custom arrows

## Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
`appendArrows` | `HTMLElement` | `null` | Change where arrows are attached (default is the target)
`appendDots` | `HTMLElement` | `null` | Change where the navigation dots are attached
`arrows` | `boolean` | `true` | enable or disable arrows
`autoplay` | `boolean` | `false` | Auto play the carousel
`autoplaySpeed` | `number` | `3000` | Change the interval at which autoplay change slide
`dots` | `boolean` | `true` | Display or hide dots
`infinite` | `boolean` | `true` | Enable or disable infinite behavior
`nextArrow` | `HTMLElement` | `null` | Customize the "next" arrow
`pauseOnHover` | `boolean` | `true` | pause autoplay when a slide is hovered,
`prevArrow` | `HTMLElement` | `null` | Customize the "previous" arrow
`responsive` | `Array` | `null` | breakpoints config, [see below](#responsive-option-example)
`slidesToShow` | `number` | `1` | Number of slide to show at once
`slidesToScroll` | `number` | `1` | Number of slide to scroll at once
`speed` | `number` | `300` | transition speed when changing slide
`swipe` | `boolean` | `true` | Enable or disable drag to change slide
`transition` | one of: `'slide'`, `'fade'` | `'slide'` | Change transition type when changing slide<br/>NOTE: transition 'fade' disable options `slidesToShow` and `slidesToScroll`    

#### Responsive option example

The responsive option takes an array of breakpoints, each one should be an object structured as follow:

- `breakpoint` • Number • Screen width at which the breakpoint will be activated
- `settings` • Object • Object containing options that will overwrite initial options

> __LIMITATION__: the `settings` property only accepts overwrites for these options:
>
> `slidesToShow`,`slidesToScroll`,`infinite`
>
> This list could increase over time

Only one breakpoint will be enabled at a time.

```javascript
const options = {
  // [...]
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true
      }
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false
      }
    },
  ]
}
```

