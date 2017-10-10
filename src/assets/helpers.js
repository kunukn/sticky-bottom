export const log = console.log.bind(console);

export function qs(expr, context) {
  return (context || document).querySelector(expr);
}
export function qsa(expr, context) {
  return [].slice.call((context || document).querySelectorAll(expr), 0);
}

export const rAF = window.requestAnimationFrame || (callback => setTimeout(callback.bind(this), 0));

export function getScrollPosition() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0
  );
}

export function getViewHeight() {
  return Math.max(window.innerHeight, 0);
}

export function addCss(el, css) {
  if (css && Array.isArray(css)) {
    // in loop because IE11
    css.forEach(c => el.classList.add(c));
  } else {
    el.classList.add(css);
  }
}
export function delCss(el, css) {
  if (css && Array.isArray(css)) {
    // in loop because IE11
    css.forEach(c => el.classList.remove(c));
  } else {
    el.classList.remove(css);
  }
}

export function getStickyVendorPrefixAsString() {
  const el = document.createElement('div');
  const names = ['sticky', 'webkitSticky'];

  for (let i = 0; i < names.length; i += 1) {
    const name = names[i];
    el.style.position = name;
    if (el.style.position === name) {
      return name;
    }
  }
  return undefined;
}
