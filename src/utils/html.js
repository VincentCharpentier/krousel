const ATTR_MAP = {
  className: 'class',
};

const Case = {
  snakeToCamel(str) {
    return str.replace(/-[A-Z]/gi, (s) => s[1].toUpperCase());
  },
  camelToSnake(str) {
    return str.replace(/[A-Z]/g, (s) => '-' + s.toLowerCase());
  },
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
      .map(([k, v]) => `${Case.camelToSnake(k)}:${v}`)
      .join(';');
  },
  parseStyle(style) {
    return Object.fromEntries(
      style
        .split(';')
        .filter((x) => x.length > 0)
        .map((rule) => rule.split(':').map((x) => x.trim()))
        .map(([key, v]) => [Case.snakeToCamel(key), v]),
    );
  },
  setElementStyle(element, styleObj) {
    const currentStyle = this.parseStyle(element.getAttribute('style'));
    const mergedStyle = { ...currentStyle, ...styleObj };
    // drop null entries
    Object.entries(mergedStyle).forEach(([k, v]) => {
      if (v === null) {
        delete mergedStyle[k];
      }
    });
    element.setAttribute('style', this.makeStyle(mergedStyle));
  },
};

export default htmlUtils;
