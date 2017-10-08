import './StickyBottom.scss';
import {
  qs,
  rAF,
  getScrollPosition,
  getViewHeight,
  addCss,
  delCss,
  getStickyVendorPrefixAsString,
} from './helpers';

const BCR = 'getBoundingClientRect';

export default class StickyBottom {
  constructor(props) {
    const defaultProps = {
      elems: {
        area: '.js.kn-sticky-bottom',
        box: '.kn-sticky-bottom__box',
        boundary: '.kn-sticky-bottom__boundary',
      },
    };
    this.props = { ...defaultProps, ...props };

    this.state = {
      scroll: {},
      rect: {},
      cssSticky: getStickyVendorPrefixAsString(),
    };

    const areaEl = qs(this.props.elems.area);
    this.elems = {
      area: areaEl,
      box: qs(this.props.elems.box, areaEl),
      boundary: qs(this.props.elems.boundary, areaEl),
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
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    return this;
  }
  initAndUpdateDimensions() {
    this.state.rect = {
      ...this.state.rect,
      area: this.elems.area[BCR](),
      box: this.elems.box[BCR](),
      boundary: this.elems.boundary[BCR](),
    };
    this.state.scroll = {
      ...this.state.scroll,
      viewHeight: getViewHeight(),
      scrollStartPosition: getScrollPosition(),
      scrollPosition: getScrollPosition(),
    };

    this.updateDimensions();
    return this;
  }

  updateDimensions() {
    let stickyMode = '';
    const { stickyMode: stickyModePrev } = this.state.scroll;

    const { area } = this.state.rect;
    const {
      viewHeight,
      scrollStartPosition,
      scrollPosition,
    } = this.state.scroll;

    const areaTop = area.top + scrollStartPosition;
    const areaBottom = area.bottom + scrollStartPosition;

    const areaIsAfterScroll = scrollPosition - areaTop;

    const viewIsBeforeArea = areaBottom - scrollPosition - viewHeight;

    if (area.height - viewHeight <= 0) {
      stickyMode = 'after';
    } else if (areaIsAfterScroll <= 0 && viewIsBeforeArea >= 0) {
      stickyMode = 'before';
    } else if (areaIsAfterScroll >= 0 && viewIsBeforeArea >= 0) {
      stickyMode = 'fixed';
    } else {
      stickyMode = 'after';
    }

    this.state.scroll = {
      ...this.state.scroll,
      scrollPosition,
      stickyMode,
      stickyModePrev,
    };

    return this;
  }

  updateDOM({ forceUpdate } = {}) {
    const { area } = this.state.rect;
    const {
      viewHeight,
      stickyMode,
      stickyModePrev,
    } = this.state.scroll;

    if (stickyMode === 'before') {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = 'debug: state before';
      }
      const el = this.elems.box;
      el.style.position = 'absolute';
      el.style.bottom = `${area.height - viewHeight}px`;
      el.style.left = '';
      el.style.width = '';
      delCss(this.elems.area, ['kn-is-fixed', 'kn-is-after']);
      addCss(this.elems.area, 'kn-is-before');
    } else if (stickyMode === 'fixed') {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = 'debug: state fixed';
      }
      const el = this.elems.box;
      el.style.position = 'fixed';
      el.style.bottom = '';
      el.style.left = `${area.left}px`;
      el.style.width = `${area.width}px`;
      delCss(this.elems.area, ['kn-is-before', 'kn-is-after']);
      addCss(this.elems.area, 'kn-is-fixed');
    } else if (stickyMode === 'after') {
      if (!forceUpdate && stickyModePrev === stickyMode) {
        // no DOM update needed
        return this;
      }
      if (this.elems.debug) {
        this.elems.debug.textContent = 'debug: state after';
      }
      const el = this.elems.box;
      el.style.position = 'absolute';
      el.style.bottom = '';
      el.style.left = '';
      el.style.width = '';
      delCss(this.elems.area, ['kn-is-before', 'kn-is-fixed']);
      addCss(this.elems.area, 'kn-is-after');
    }

    return this;
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
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
