const ATTR_MAP = {
  className: 'class',
};

const htmlUtils = {
  append(target, elements) {
    let toAppend = elements;
    if (elements instanceof HTMLCollection) {
      toAppend = Array.from(elements);
    }
    if (toAppend instanceof Array) {
      toAppend.forEach((child) => target.appendChild(child));
    } else {
      target.appendChild(toAppend);
    }
  },
  createElement(tag, attrs = {}, children = null) {
    let element = document.createElement(tag);
    Object.entries(attrs).forEach(([attr, value]) => {
      const finalAttr = ATTR_MAP[attr] || attr;
      element.setAttribute(finalAttr, value);
    });
    if (children) {
      if (children instanceof Array) {
        children.forEach((child) => element.appendChild(child));
      } else {
        element.appendChild(children);
      }
    }
    return element;
  },
  makeStyle(props) {
    return Object.entries(props)
      .map(([k, v]) => {
        const key = k.replace(/[A-Z]/g, (s) => '-' + s.toLowerCase());
        return `${key}:${v}`;
      })
      .join(';');
  },
};

export default htmlUtils;
