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
