/// <reference types="react-dom" />

declare namespace ReactDOM {
  interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }

  function createRoot(container: Element | Document | DocumentFragment | null): Root;
  function hydrateRoot(container: Element | Document | DocumentFragment, children: React.ReactNode): Root;
} 