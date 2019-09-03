# Create a Virtual DOM
Here we're going to go over creating our own very basic virtual DOM framework.

**NOTE** This version will **not** handle applying diffs between renders and will instead throw out the previous DOM and render a whole new one. As such this example is not intended for proper use but illustrates the core concepts of a virtual DOM.

## What's the difference between a Node and an Element?
First some info about terminology.

### Node:
Nodes are the base class for all objects that be in a `document`, including the `document` itself.

Properties common to nodes:
* parentNode
* childNodes
* nodeName

All the common stuff for navigating the document tree.

Example nodes:
* The `document` itself
* Text elements
* HTML elements (div, span, input, etc)
* HTML comments

### Element:
So elements are a subclass of node and are specifically for `<element>` type nodes.

Properties common to elements:
* className
* innerHTML
* attributes

## Creating the data structures
So we're aiming to have a way to create DOM elements from some JavaScript Objects (not quite JSON since we want to be able to pass functions to event handlers).

Generally speaking each element is made up of a node type (div, span, h1, etc), a map of attributes {class, src, href, onclick, onmousemove, etc} and a list of child elements.

By convention the map of attributes is called `props` however this could be called anything we want. In fact we could separate out plain value attributes from event handlers, but we'll keep them all together in this case.

Let's start with the most basic example.
```typescript
// How we want our virtual elements to look like
export interface VirtualElement
{
    // The name of the node type ('div', 'span', etc)
    type: string;

    // Properties of the this virtual DOM element.
    props: Props;

    // Children can be text or another object element.
    // We need the text special type otherwise we wouldn't have a way to specify text.
    children: VirtualNode[];
}

// Our properties/attributes are just a map of string keys to any value at the moment.
interface Props
{
    [key: string]: any;
}

// A virtual node is either and element above or plain text.
export type VirtualNode = VirtualElement | string;

// Example header element.
const header: VirtualElement = {
    type: 'h1',
    props: {},
    children: ['Our first virtual DOM']
}
```

We want to be able to turn this into something that would look like this in HTML:

```html
<h1>Our first virtual DOM</h1>
```

### A create function
So our create function needs to take a `VirtualNode` and turn it into a `Node`.

How do we create an element in the DOM with the DOM API?

1. The `document` object, is our main entry point to creating new elements to add to the document.
2. There are two functions on the `document` object for creating elements `createTextNode` for text only nodes and `createElement` for all other nodes.
3. After the node has been created we actually need to attach it somewhere in the `document`. By default the `document` always has a `body`.
4. Done!

So let's put that into practice with our own `create` function.

```typescript
// Takes a virtual node and turns it into a DOM node.
function create(node: VirtualNode): Node
{
    // Check for string element
    if (typeof(node) === 'string')
    {
        // The DOM already has a function for creating text nodes.
        return document.createTextNode(node);
    }

    // The createElement function accepts the node type as a string.
    const domElement = document.createElement(node.type);

    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in node.props)
    {
        // setAttribute is used for any attribute on an element such as class, value, src, etc.
        domElement.setAttribute(prop, node.props[prop]);
    }

    // Append all child elements.
    for (const child of node.children)
    {
        domElement.append(create(child));
    }

    return domElement;
}
```

Now we should be able to use the function just like this.

```typescript
const domElement = create(header);
document.body.append(domElement);
```

### Adding event handlers
Before we can make an interesting event handler we're going to need some event handling functionality.

For the sack of convention and compatibility with other frameworks lets add the event handlers to the `props` map.

So how do we add an event handler using the DOM API?

1. Get a DOM element, one you've just created works well (it `document.createElement`).
2. There's a function on all elements called `addEventListener`. For now we're going to care about the first two arguments to this function the `type` and `listener`. More info [here](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).
3. We need to know the `type` which a full list can be found [here](https://developer.mozilla.org/en-US/docs/Web/Events). For example a click is just called `click`.
4. We also need an event handler which is the function to be called and will generally be called with an `Event` object.
5. Done?

Given that all the attributes and event listeners are on the same object we need to way to differentiate them. One way is to assume any function could be an event listener, but that would limit our ability to pass functions for any other purpose. Another is to look for specific keywords, we can put together a list of known event handlers which is probably ideal. However for simplicity in this example lets assume that any property starting with 'on' is going to be an event listener.

So let's update our create function:

```typescript
// Takes a virtual node and turns it into a DOM node.
function create(node: VirtualNode): Node
{
    // Check for string element
    if (typeof(node) === 'string')
    {
        // The DOM already has a function for creating text nodes.
        return document.createTextNode(node);
    }

    // The createElement function accepts the node type as a string.
    const domElement = document.createElement(node.type);

    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in node.props)
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
            domElement.addEventListener(prop.substr(2), node.props[prop]);
        }
        else
        {
            // setAttribute is used for any attribute on an element such as class, value, src, etc.
            domElement.setAttribute(prop, node.props[prop]);
        }
    }

    // Append all child elements.
    for (const child of node.children)
    {
        domElement.append(create(child));
    }

    return domElement;
}
```

Let's also create a helper function for creating the virtual DOM elements

```typescript
// Helper function for creating virtual DOM object.
function vdom(type: string, props: Props, ...children: VirtualNode[]): VirtualElement
{
    return { type, props, children };
}
```

## Let's use what we've got to render an app

```typescript
function onClickButton()
{
    alert('Clicked the button!');
}

function render()
{
    // Example app
    const app = vdom('main', {},
        vdom('h1', {}, 'Header'),
        vdom('p', {},
            vdom('strong', {}, 'A button'),
            vdom('button', { onclick: onClickButton }, 'Button Text')
        )
    );

    // Create the DOM elements
    const domApp = create(app);
    document.body.append(domElement);
}
```

So this will render our app with a button that has a click event attached!

The `vdom` calls don't make it easy to read and you probably don't want to create any big complicated interfaces with it, but you could.

## Can we render it again?

So the last example allows us to render the app at least once but it will directly append the result to the document body each time which doesn't really allow for rendering again after something has changed.

So we need a node to render into and we want to check if the parent node has any children already.

```typescript
// Renders the given virtualNode into the given parent node.
// This will clear the parent node of all its children.
function render(virtualNode: VirtualNode, parent: Node)
{
    const domNode = create(virtualNode);

    // Make sure to clear the parent node of any children.
    while (parent.childNodes.length > 0)
    {
        parent.firstChild.remove();
    }

    // Now add our rendered node into the parent.
    parent.appendChild(domNode);
}

```

## An interactive example
Now that we can render the app multiple times lets create a very basic interactive example.

```typescript
// We've moved the generic rendering functions into their own file.
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
```

## A built example
There's an example [here](./virtualDomExample/deploy/example1.html) with the code found [here](./virtualDomExample/).

## What about components?
So far we've been just been worrying about creating what's called intrinsic element, basically existing HTML elements. But what about components?

This comes down to how you would want to organise a more complex UI framework like React.

Two ways is to use a function that takes the `props` and returns a new virtual node made up of just intrinsic elements. Another is to use a class instance that has a known `render` function that returns the virtual node.

Let's take a look at the function version

```typescript
type CreateNode = (props: Props) => VirtualNode;
```

Now wan update our data structures:

```typescript
export interface VirtualElement
{
    // The name of the node type ('div', 'span', etc)
    type: VirtualNodeType;

    // Properties of the this virtual DOM element.
    props: Props;

    // Children can be text or another object element.
    // We need the text special type otherwise we wouldn't have a way to specify text.
    children: VirtualNode[];
}

export type CreateNode = (props: Props) => VirtualNode;
export type VirtualNodeType = string | CreateNode;

export function vdom(type: VirtualNodeType, props: Props, ...children: VirtualNode[]): VirtualElement
{
    return { type, props, children };
}
```

We have had to allow for the node type to be either a string or a function that will create a virtual node.

Let's update our create function again!

```typescript
// Takes a virtual node and turns it into a DOM node.
export function create(node: VirtualNode): Node
{
    // Check for string element
    if (typeof(node) === 'string')
    {
        // The DOM already has a function for creating text nodes.
        return document.createTextNode(node);
    }

    // Check for functional render
    if (typeof(node.type) === 'function')
    {
        return create(node.type(node.props));
    }

    // The createElement function accepts the node type as a string.
    const domElement = document.createElement(node.type);

    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in node.props)
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
            domElement.addEventListener(prop.substr(2), node.props[prop]);
        }
        else
        {
            // setAttribute is used for any attribute on an element such as class, value, src, etc.
            domElement.setAttribute(prop, node.props[prop]);
        }
    }

    // Append all child elements.
    for (const child of node.children)
    {
        domElement.append(create(child));
    }

    return domElement;
}
```

We only had to add one check for the `node.type` being a function.

Let's also update our example to make a somewhat contrived use of the a functional render.

```typescript
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
```

[Here](./virtualDomExample/deploy/example2.html) is a built example using the functional arguments.