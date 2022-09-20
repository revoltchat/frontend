import "solid-styled-components";

declare module "solid-styled-components" {
  export interface DefaultTheme {
    colours: {
      [key in
        | 'accent'
        | 'foreground'
        | `foreground-${100 | 200 | 300 | 400}`
        | 'background'
        | `background-${100 | 200 | 300 | 400}`
        | `status-${'online' | 'idle' | 'focus' | 'busy' | 'streaming' | 'offline'}`]: string;
    };
    breakpoints: {
      [key in 'sm' | 'md' | 'lg' | 'xl']: string;
    };
    borderRadius: {
      [key in 'md' | 'lg']: string;
    };
  }
}
