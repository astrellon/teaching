declare namespace JSX
{
    // The IntrinsicElements interface is a special case that TypeScript
    // will look at for types when it comes to built in browser HTML elements.
    interface IntrinsicElements
    {
        // The HTMLDivElement, HTMLSpanElement, etc interfaces are
        // already defined in TypeScript and we are just reusing them.

        // The Partial interface sets that all the fields in the given
        // interface are now optional instead of required.

        // React and other frameworks sometimes create their own
        // interfaces to the HTML elements. For example with React
        // they use 'onClick' instead of 'onclick' because they
        // use their own layer of event handling.
        div: Partial<HTMLDivElement>;
        span: Partial<HTMLSpanElement>;
        button: Partial<HTMLButtonElement>;
        h1: Partial<HTMLHeadingElement>;
        p: Partial<HTMLParagraphElement>;
        strong: Partial<HTMLElement>;
        main: Partial<HTMLElement>;
    }
}