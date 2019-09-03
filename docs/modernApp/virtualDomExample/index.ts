import { vdom, render } from "./vdom";

let buttonClickTimes = 0;
function onClickButton()
{
    buttonClickTimes++;
    renderApp();
}

function renderApp()
{
    // Example app
    const app = vdom('main', {},
        vdom('h1', {}, 'Header'),
        vdom('p', {},
            vdom('strong', {}, 'A button'),
            vdom('button', { onclick: onClickButton }, 'Button Text'),
            vdom('span', {}, `Button clicked ${buttonClickTimes} times`)
        )
    );

    const rootElement = document.getElementById('root');
    render(app, rootElement);
}

// Render the app on start
renderApp();