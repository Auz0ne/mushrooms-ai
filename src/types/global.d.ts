// Global type declarations for browser APIs

interface VisualViewport extends EventTarget {
  readonly height: number;
  readonly width: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly scale: number;
}

interface Window {
  visualViewport: VisualViewport | null;
} 