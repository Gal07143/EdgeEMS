
declare module 'react/jsx-runtime' {
  import { ReactElement, Key, JSXElementConstructor } from 'react';
  
  export namespace JSX {
    interface Element extends ReactElement {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export function jsx(
    type: string | JSXElementConstructor<any>,
    props: any,
    key?: Key | null
  ): JSX.Element;
  
  export function jsxs(
    type: string | JSXElementConstructor<any>,
    props: any,
    key?: Key | null
  ): JSX.Element;
}

declare module 'react/jsx-dev-runtime' {
  export * from 'react/jsx-runtime';
}
