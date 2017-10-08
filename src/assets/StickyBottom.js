import './StickyBottom.scss';

const log = console.log.bind(console);
const BCR = "getBoundingClientRect";

export default class StickyBottom {
  constructor(props) {
    const defaultProps = {
      elems: {
        area: ".js.kn-sticky-bottom",
        box: ".kn-sticky-bottom__box",
        boxInner: ".kn-sticky-bottom__box-inner",
        boundary: ".kn-sticky-bottom__boundary"
      }
    };
    this.props = { ...defaultProps, ...props };

    this.state = {
      scroll: {},
      rect: {}
    };

    const areaEl = qs(this.props.elems.area);
    this.elems = {
      area: areaEl,
      box: qs(this.props.elems.box, areaEl),
      boxInner: qs(this.props.elems.boxInner, areaEl),
      boundary: qs(this.props.elems.boundary, areaEl)
    };
    if (this.props.debug) {
      this.elems.debug = qs(this.props.debug);
    }

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  init() {
    this.initAndUpdateDimensions();
    this.updateDOM({ forceUpdate: true });
    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.onResize);
    return this;
  }
  initAndUpdateDimensions() {
    
    this.state.rect = {
      ...this.state.rect,
      area: this.elems.area[BCR](),
      box: this.elems.box[BCR](),
      boxInner: this.elems.boxInner[BCR](),
      boundary: this.elems.boundary[BCR]()
    };
    this.state.scroll = {
      ...this.state.scroll,
      viewHeight: getViewHeight(),
      scrollStartPosition: getScrollPosition(),
      scrollPosition: getScrollPosition()
    };

    this.updateDimensions();
    return this;
  }

  updateDimensions() {
    let stickyMode = "";
    let { stickyMode: stickyModePrev } = this.state.scroll;

    const { area, boxInner } = this.state.rect;
    const {
      viewHeight,
      scrollStartPosition,
      scrollPosition
    } = this.state.scroll;

    const areaTop = area.top + scrollStartPosition;
    const areaBottom = area.bottom + scrollStartPosition;

    const areaIsAfterScroll = scrollPosition - areaTop;

    const viewIsBeforeArea = areaBottom - scrollPosition - viewHeight;

    if (area.height - viewHeight <= 0) {
      stickyMode = "after";
    } else if (areaIsAfterScroll <= 0 && viewIsBeforeArea >= 0) {
      stickyMode = "before";
    } else if (areaIsAfterScroll >= 0 && viewIsBeforeArea >= 0) {
      stickyMode = "fixed";
    } else {
      stickyMode = "after";
    }

    this.state.scroll = {
      ...this.state.scroll,
      scrollPosition,
      stickyMode,
      stickyModePrev
    };

    return this;
  }

  updateDOM({ forceUpdate } = {}) {
    const { area, box, boxInner, boundary } = this.state.rect;
    const {
      scrollPosition,
      viewHeight,
      stickyMode,
      stickyModePrev
    } = this.state.scroll;

    if (stickyMode === "before") {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = "debug: state before";
      }
      const el = this.elems.boxInner;
      el.style.position = "absolute";
      el.style.bottom = `${area.height - viewHeight}px`;
      el.style.left = "";
      el.style.width = "";
      delCss(this.elems.area, ["kn-is-fixed", "kn-is-after"]);
      addCss(this.elems.area, "kn-is-before");
    } else if (stickyMode === "fixed") {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = "debug: state fixed";
      }
      const el = this.elems.boxInner;
      el.style.position = "fixed";
      el.style.bottom = "";
      el.style.left = `${box.left}px`;
      el.style.width = `${box.width}px`;
      delCss(this.elems.area, ["kn-is-before", "kn-is-after"]);
      addCss(this.elems.area, "kn-is-fixed");
    } else if (stickyMode === "after") {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = "debug: state after";
      }
      const el = this.elems.boxInner;
      el.style.position = "absolute";
      el.style.bottom = "";
      el.style.left = "";
      el.style.width = "";
      delCss(this.elems.area, ["kn-is-before", "kn-is-fixed"]);
      addCss(this.elems.area, "kn-is-after");
    }

    return this;
  }

  destroy() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    return this;
  }

  onScroll() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/scroll
    this.state.scroll.scrollPosition = getScrollPosition();
    if (!this.state.scroll.ticking) {
      rAF(() => {
        this.updateDimensions();
        this.updateDOM();
        this.state.scroll.ticking = false;
      });
    }
    this.state.scroll.ticking = true;
  }

  onResize() {
    rAF(() => {
      this.initAndUpdateDimensions.call(this);
      this.updateDOM.call(this, { forceUpdate: true });
    });
  }
}

function qs(expr, context) {
  return (context || document).querySelector(expr);
}
function qsa(expr, context) {
  return [].slice.call((context || document).querySelectorAll(expr), 0);
}

function rAF(callback) {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 0);
  }
}

function getScrollPosition() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0
  );
}

function getViewHeight() {
  return Math.max(window.innerHeight, 0);
}

function addCss(el, css) {
  if (css && Array.isArray(css)) {
    // in loop because IE11
    css.forEach(c => el.classList.add(c));
  } else {
    el.classList.add(css);
  }
}
function delCss(el, css) {
  if (css && Array.isArray(css)) {
    // in loop because IE11
    css.forEach(c => el.classList.remove(c));
  } else {
    el.classList.remove(css);
  }
}
