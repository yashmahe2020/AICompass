export {};

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    [key: string]: any;
  }
} 