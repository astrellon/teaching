// How we want our object elements to look like
interface ObjectElement
{
    // The name of the node type ('div', 'span', etc)
    type: string;

    props: Props;

    // Children can be text or another object element.
    // We need the text special type otherwise we wouldn't have a way to specify text.
    children: VirtualElement[];
}

// Our properties/attributes are just a map of string keys to any value at the moment.
interface Props
{
    [key: string]: any;
}

// An element is either the object above or plain text.
type VirtualElement = ObjectElement | string;

function create(element: VirtualElement): HTMLElement | Text
{
    // Check for string element
    if (typeof(element) === 'string')
    {
        // The DOM already has a function for creating text nodes.
        return document.createTextNode(element);
    }

    // The createElement function accepts the node type as a string.
    const domElement = document.createElement(element.type);

    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in element.props)
    {
        // Check if the string starts with the letters 'on'.
        // Note this function is not available in Internet Explorer.
        if (prop.startsWith('on'))
        {
            // Chop off the first two characters and use the rest as the event listener type.
            // Note: This is *not* the correct way to do this.
            // It'll pick on anything that starts with 'on', like 'onion' or 'once'.
            // Also we're not checking if the value is actually a function.
            // For now to get a working example UI we'll go with it.
            domElement.addEventListener(prop.substr(2), element.props[prop]);
        }
        else
        {
            // setAttribute is used for any attribute on an element such as class, value, src, etc.
            domElement.setAttribute(prop, element.props[prop]);
        }
    }

    // Append all child elements.
    for (const child of element.children)
    {
        domElement.append(create(child));
    }

    return domElement;
}

function render(virtualElement: VirtualElement)
{
    const rootDomElement = document.getElementById('root');
    const domApp = create(virtualElement);

    if (rootDomElement.childNodes.length > 0)
    {
        rootDomElement.replaceChild(domApp, rootDomElement.childNodes[0]);
    }
    else
    {
        rootDomElement.append(domApp);
    }
}

function vdom(type: string, props: Props, ...children: VirtualElement[]): ObjectElement
{
    return { type, props, children };
}

let buttonClickTimes = 0;
function onClickButton()
{
    buttonClickTimes++;
    render(renderApp());
}

function renderApp()
{
    // Example app
    return vdom('main', {},
        vdom('h1', {}, 'Header'),
        vdom('p', {},
            vdom('strong', {}, 'A button'),
            vdom('button', { onclick: onClickButton }, 'Button Text'),
            vdom('span', {}, `Button clicked ${buttonClickTimes} times`)
        )
    );
}

// Render the app
render(renderApp());