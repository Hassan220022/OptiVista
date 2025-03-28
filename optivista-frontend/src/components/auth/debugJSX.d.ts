// This is a temporary TypeScript declaration file for debugging purposes
// It defines basic JSX intrinsic elements to avoid TypeScript errors

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      p: any;
      a: any;
      button: any;
      input: any;
      textarea: any;
      select: any;
      option: any;
      form: any;
      label: any;
      svg: any;
      path: any;
      circle: any;
      strong: any;
    }
  }
}

// Add React event types for our debugging component
declare namespace React {
  interface SyntheticEvent {
    preventDefault(): void;
  }
  
  interface FormEvent extends SyntheticEvent {}
} 