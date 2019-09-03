# Adding Virtual DOM JSX Support
So we've got a very basic virtual DOM implementation that can take virtual nodes and create real DOM nodes.

But creating those virtual nodes is a bit of a pain with all those function calls.

This is where JSX comes in.

## TypeScript JSX support
As JSX support is built into TypeScript the way to use it requires setting some config values in the `tsconfig.json` file.

The main component for adding JSX support is to define how JSX works in our framework. The full documentation is [here](https://www.typescriptlang.org/docs/handbook/jsx.html).

So far we haven't had to worry about the `tsconfig.json` for the TypeScript compiling step but to support JSX we need to have these options. The main two are really `jsxFactory` and `jsx`, and here is a complete config.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "jsxFactory": "vdom",
        "jsx": "react"
    },
    "files": ["index.tsx"]
}
```

Despite the name the `"jsx": "react"` doesn't mean we're actually using react but it refers to how the JSX is processed. In this case it means that `<div>Hi</div>` gets turned into `vdom("div", {}, ['Hi'])`.

## JSX Namespace
The next main component to adding support is to define the `JSX` namespace for TypeScript. This is one of the few places where certain names are hardcoded so we need to match them exactly.

We are going to create a file to contain our `JSX` namespace called `jsx.d.ts`.

```typescript
// jsx.d.ts
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
```

And add to the top of the `vdom.ts` file we need to refer to the `jsx.d.ts` file.

```typescript
/// <reference path='jsx.d.ts' />
```

At this point simply changing the filename extension to `.tsx` and other references to that file and it should just work!

```tsx
import { vdom, render, VirtualNode } from "./vdom";

let buttonClickTimes = 0;
function onClickButton()
{
    buttonClickTimes++;
    renderApp();
}

// TypeScript uses the same convention that React does for
// distinguishing between these.
// An intrinsic element always begins with a lowercase letter,
// and a value-based element always begins with an uppercase letter.
function SayHi(props: {name: string}): VirtualNode
{
    return <div>
        Hello <strong>{props.name}</strong>
    </div>
}

function renderApp()
{
    // Example app
    const app = <main>
        <h1>Header</h1>
        <p>
            <strong>A button</strong>
            <button onclick={onClickButton}>Button Text</button>
            <span>{`Button clicked ${buttonClickTimes} times`}</span>
        </p>
        <p>
            Functional components
            <SayHi name="Foo" />
            <SayHi name="Bar" />
        </p>
    </main>;

    const rootElement = document.getElementById('root');
    render(app, rootElement);
}

// Render the app on start
renderApp();
```

## A built example
[Here](./addingJsxVirtualDom/deploy/index.html) is a built example of this. Although it shouldn't look any different except under the hood the source code uses JSX.