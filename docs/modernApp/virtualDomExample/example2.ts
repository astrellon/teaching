import { vdom, render, VirtualNode } from "./vdom";

let buttonClickTimes = 0;
function onClickButton()
{
    buttonClickTimes++;
    renderApp();
}

function sayHi(props: {name: string}): VirtualNode
{
    return vdom('div', {},
        'Hello ',
        vdom('strong', {}, props.name)
    );
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
        ),

        vdom('p', {},
            'Using render functions',
            vdom(sayHi, {name: 'Foo'}),
            vdom(sayHi, {name: 'Bar'})
        )
    );

    const rootElement = document.getElementById('root');
    render(app, rootElement);
}

// Render the app on start
renderApp();
