import G6 from '@antv/g6';
import { createDom, modifyCSS, getWidth, getStyle } from '@antv/dom-util';
const INPUT_ID_PRE = 'alone-g6-input';
const DEFAULT_STYLE = {
  display: 'inline-block',
  position: 'absolute',
  textAlign: 'center',
  overflow: 'hidden',
  fontSize: '14px'
};
let inputId;
let promise;
let upType;

const create = parent => {
  let parentDom;
  if (parent) {
    if (parent instanceof HTMLElement) {
      parentDom = parent;
    } else if (typeof parent === 'string') {
      parentDom = document.querySelector(parent);
    }
  }
  inputId = `${INPUT_ID_PRE}-${Date.now()}`;
  parentDom = parentDom || document.body;
  const dom = createDom(`<input id="${inputId}" class="g6-edit-input" />`);
  parentDom.appendChild(dom);
  return dom;
};

const newPromise = (node, dom, oldLabel, { autoUpdate, textOverflow, textEllipsis, padding }) => {
  return new Promise(resolve => {
    const onBlur = () => {
      dom.removeEventListener('blur', onBlur);
      dom.removeEventListener('keyup', onEnter);
      modifyCSS(dom, {
        display: 'none'
      });
      const value = dom.value.trim();
      const model = node.getModel();
      let width = node.getKeyShape()?.attr('width') || model.size?.[0] || getWidth(dom);
      width = width - padding * 2;
      const fontSize = model.labelCfg?.style?.fontSize || parseFloat(getStyle(dom, 'fontSize', 14));
      const fittingValue = textOverflow === 'ellipsis' ? fittingEllipsisString(value, width, fontSize, textEllipsis) : fittingString(value, width, fontSize);
      if (autoUpdate) {
        node.update({
          label: fittingValue,
          history: false,
          attr: {
            ...(model.attr || {}),
            realLabel: value
          }
        });
      }
      resolve({
        value,
        oldLabel,
        fittingValue
      });
      promise = null;
    };
    const onEnter = (e) => {
      if (e.keyCode === 13) {
        onBlur();
      }
    };
    dom.addEventListener('blur', onBlur);
    dom.addEventListener('keyup', onEnter);
  });
};

export const fittingString = (str, maxWidth, fontSize) => {
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${str.substr(i)}`;
    }
  });
  return res;
};

export const fittingEllipsisString = (str, maxWidth, fontSize, ellipsis = '...') => {
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};

export const addClass = (dom, name) => {
  const { className } = dom;
  const classList = className.split(' ');
  if (classList.includes(name)) {
    return;
  }
  classList.push(name);
  dom.className = classList.join(' ');
};

export const removeClass = (dom, name) => {
  const { className } = dom;
  const classList = className.split(' ').filter(n => n !== name);
  dom.className = classList.join(' ');
};

export const showInput = async (node, {
  parent,
  style,
  graph,
  autoUpdate = true,
  focusClear = true,
  onFocus,
  textOverflow = 'ellipsis',
  textEllipsis = '...',
  padding = 0,
  event
} = {}) => {
  if (promise) {
    return promise;
  }
  let dom = inputId ? document.querySelector(`input#${inputId}`) : null;
  if (!dom) {
    dom = create(parent);
  }
  const model = node.getModel();
  const type = node.getType();
  const typeHandler = require(`./${type}`);
  const typeAttr = typeHandler(node, model, graph);
  const customStyle = typeof style === 'function' ? style(type, typeAttr, node, model) : style;
  const label = model.attr.realLabel || model.label || '';
  removeClass(dom, upType);
  addClass(dom, type);
  upType = type;
  dom.value = label;
  if (typeof onFocus === 'function') {
    await Reflect.apply(onFocus, dom, [node, label, event]);
  }
  if (focusClear) {
    node.update({
      label: ''
    });
  }
  modifyCSS(dom, {
    ...DEFAULT_STYLE,
    left: `${typeAttr.left}px`,
    top: `${typeAttr.top}px`,
    width: `${typeAttr.width}px`,
    height: `${typeAttr.height}px`,
    ...customStyle
  });
  dom.focus && dom.focus();
  promise = newPromise(node, dom, label, { autoUpdate, graph, textOverflow, textEllipsis, padding});
  return promise;
};
