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
        <td><pre>appendArrows</pre></td>
        <td><pre>HTMLElement</pre></td>
        <td><pre>null</pre></td>
        <td>Change where arrows are attached (default is the target)</td>
    </tr>
    <tr>
        <td><pre>appendDots</pre></td>
        <td><pre>HTMLElement</pre></td>
        <td><pre>null</pre></td>
        <td>Change where the navigation dots are attached</td>
    </tr>
    <tr>
        <td><pre>arrows</pre></td>
        <td><pre>boolean</pre></td>
        <td><pre>true</pre></td>
        <td>enable or disable arrows</td>
    </tr>
    <tr>
        <td><pre>autoplay</pre></td>
        <td><pre>boolean</pre></td>
        <td><pre>false</pre></td>
        <td>Auto play the carousel</td>
    </tr>
    <tr>
        <td><pre>autoplaySpeed</pre></td>
        <td><pre>number</pre></td>
        <td><pre>3000</pre></td>
        <td>Change the interval at which autoplay change slide</td>
    </tr>
    <tr>
        <td><pre>dots</pre></td>
        <td><pre>boolean</pre></td>
        <td><pre>true</pre></td>
        <td>Display or Hide dots</td>
    </tr>
    <tr>
        <td><pre>infinite</pre></td>
        <td><pre>boolean</pre></td>
        <td><pre>true</pre></td>
        <td>Enable or disable infinite behavior</td>
    </tr>
    <tr>
        <td><pre>nextArrow</pre></td>
        <td><pre>HTMLElement</pre></td>
        <td><pre>null</pre></td>
        <td>Customize the "next" arrow</td>
    </tr>
    <tr>
        <td><pre>pauseOnHover</pre></td>
        <td><pre>boolean</pre></td>
        <td><pre>true</pre></td>
        <td>pause autoplay when a slide is hovered,</td>
    </tr>
    <tr>
        <td><pre>prevArrow</pre></td>
        <td><pre>HTMLElement</pre></td>
        <td><pre>null</pre></td>
        <td>Customize the "previous" arrow</td>
    </tr>
    <tr>
        <td><pre>responsive</pre></td>
        <td><pre>object</pre></td>
        <td><pre>null</pre></td>
        <td>breakpoints config, see below</td>
    </tr>
    <tr>
        <td><pre>slidesToShow</pre></td>
        <td><pre>number</pre></td>
        <td><pre>1</pre></td>
        <td>Number of slide to show at once</td>
    </tr>
    <tr>
        <td><pre>slidesToScroll</pre></td>
        <td><pre>number</pre></td>
        <td><pre>1</pre></td>
        <td>Number of slide to scroll when clicking on arrow</td>
    </tr>
    <tr>
        <td><pre>speed</pre></td>
        <td><pre>number</pre></td>
        <td><pre>300</pre></td>
        <td>transition speed when changing slide</td>
    </tr>
    <tr>
        <td><pre>transition</pre></td>
        <td><pre>'slide'|'fade'</pre></td>
        <td><pre>'slide'</pre></td>
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