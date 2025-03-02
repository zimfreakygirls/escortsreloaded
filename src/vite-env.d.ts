
/// <reference types="vite/client" />

// Add custom types here
declare namespace JSX {
  interface IntrinsicElements {
    'widgetbot': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      server: string;
      channel: string;
      width?: string | number;
      height?: string | number;
    }
  }
}
