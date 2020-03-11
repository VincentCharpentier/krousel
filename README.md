# krousel

Carousel library with vanilla Javascript

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
`responsive` | `Object` | `null` | breakpoints config, see below
`slidesToShow` | `number` | `1` | Number of slide to show at once
`slidesToScroll` | `number` | `1` | Number of slide to scroll at once
`speed` | `number` | `300` | transition speed when changing slide
`transition` | one of: `'slide'`, `'fade'` | `'slide'` | Change transition type when changing slide<br/>NOTE: transition 'fade' disable options `slidesToShow` and `slidesToScroll`    

## Responsive

DOC WIP