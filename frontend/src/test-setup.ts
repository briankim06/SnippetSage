import '@testing-library/jest-dom' 

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  window.ResizeObserver = MockResizeObserver;
  // @ts-ignore
  global.ResizeObserver = MockResizeObserver;
} 

if (!('scrollIntoView' in Element.prototype)) {
  // @ts-ignore
  Element.prototype.scrollIntoView = () => {};
} 