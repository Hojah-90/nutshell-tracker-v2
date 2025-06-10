declare namespace JSX {
  interface IntrinsicElements {
    'chartjs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type: string;
      data: object;
      options?: object;
    };
  }
}