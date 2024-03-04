const trim = function (str: string): string {
  return (str || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

/**
 * 查找元素是否有类名。
 * @export
 * @param {HTMLElement} el
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(el: HTMLElement, cls: string): boolean {
  return el.classList ? el.classList.contains(cls) : new RegExp("(^|\\s)" + cls + "($|\\s)").test(el.className);
}

/**
 * 给元素添加类名，支持添加多个类名。
 * @export
 * @param {HTMLElement} el
 * @param {string} cls
 * @returns {void}
 */
export function addClass(el: HTMLElement, cls: string): void {
  let curClass = el.className;
  const classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += " " + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * 移除元素的指定类名，支持多类名删除。
 * @export
 * @param {HTMLElement} el
 * @param {string} cls
 * @returns {void}
 */
export function removeClass(el: HTMLElement, cls: string): void {
  const classes = cls.split(" ");
  let curClass = el.className;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(new RegExp("(^|\\s)" + clsName + "(\\s|$)", "g"), " ");
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

export function getOffset(el: HTMLElement) {
  let x = 0;
  let y = 0;

  while (el.offsetParent) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }

  return { x, y };
}

/**
 * 查找父级节点
 */
export function getParentNode(node: Node, key: string | RegExp | Node, deep?: number) {
  let filter: (key: string | RegExp | Node, dom: Node) => boolean;

  if (typeof key !== "string") {
    filter = (key, dom) => key === dom;
  } else if (key[0] !== "[") {
    let type = { ".": "className", "#": "id" }[key.charAt(0)] as "className" | "id" | "tagName";
    if (type) {
      key = key.slice(1);
    } else {
      key = key.toUpperCase();
      type = "tagName";
    }
    filter = (key, dom) => (key as RegExp).test((dom as Element)[type]);
    key = new RegExp("(^| )" + key + "($| )");
  } else if (key.slice(-1) === "]") {
    key = key.slice(1, -1);
    filter = (key, dom) => (dom as Element).hasAttribute(key as string);
  } else {
    return null;
  }

  if (isNaN(deep)) {
    deep = 3;
  }

  let d = deep;
  let dom = node;
  for (; d && dom; d--, dom = dom.parentNode) {
    if (filter(key, dom)) {
      return dom;
    }
  }
  return null;
}
