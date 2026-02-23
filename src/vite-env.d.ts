/// <reference types="vite/client" />

interface Window {
  cue?: {
    init: (config?: {
      observer?: {
        root: null | Element;
        rootMargin: string;
        threshold: number;
      };
    }) => void;
  };
}
