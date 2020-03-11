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

<table>
    <thead>
    <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>`appendArrows`</td>
        <td>HTMLElement</td>
        <td>`null`</td>
        <td>Change where arrows are attached (default is the target)</td>
    </tr>
    <tr>
        <td>`appendDots`</td>
        <td>HTMLElement</td>
        <td>`null`</td>
        <td>Change where the navigation dots are attached</td>
    </tr>
    <tr>
        <td>`arrows`</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>enable or disable arrows</td>
    </tr>
    <tr>
        <td>`autoplay`</td>
        <td>boolean</td>
        <td>`false`</td>
        <td>Auto play the carousel</td>
    </tr>
    <tr>
        <td>`autoplaySpeed`</td>
        <td>number</td>
        <td>`3000`</td>
        <td>Change the interval at which autoplay change slide</td>
    </tr>
    <tr>
        <td>`dots`</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>Display or Hide dots</td>
    </tr>
    <tr>
        <td>`infinite`</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>Enable or disable infinite behavior</td>
    </tr>
    <tr>
        <td>`nextArrow`</td>
        <td>HTMLElement</td>
        <td>`null`</td>
        <td>Customize the "next" arrow</td>
    </tr>
    <tr>
        <td>`pauseOnHover`</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>pause autoplay when a slide is hovered,</td>
    </tr>
    <tr>
        <td>`prevArrow`</td>
        <td>HTMLElement</td>
        <td>`null`</td>
        <td>Customize the "previous" arrow</td>
    </tr>
    <tr>
        <td>`responsive`</td>
        <td>object</td>
        <td>`null`</td>
        <td>breakpoints config, see below</td>
    </tr>
    <tr>
        <td>`slidesToShow`</td>
        <td>number</td>
        <td>`1`</td>
        <td>Number of slide to show at once</td>
    </tr>
    <tr>
        <td>`slidesToScroll`</td>
        <td>number</td>
        <td>`1`</td>
        <td>Number of slide to scroll when clicking on arrow</td>
    </tr>
    <tr>
        <td>`speed`</td>
        <td>number</td>
        <td>`300`</td>
        <td>transition speed when changing slide</td>
    </tr>
    <tr>
        <td>`transition`</td>
        <td>`'slide'`|`'fade'`</td>
        <td>`'slide'`</td>
        <td>
            Change transition type when changing slide
            <br/>
            NOTE: transition 'fade' disable options slidesToShow and slidesToScroll
        </td>
    </tr>
    </tbody>
</table>

## Responsive

DOC WIP