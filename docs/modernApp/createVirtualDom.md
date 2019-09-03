# Create a Virtual DOM
Here we're going to go over creating our own very basic virtual DOM framework.

**NOTE** This version will **not** handle applying diffs between renders and will instead throw out the previous DOM and render a whole new one. As such this example is not intended for proper use but illustrates the core concepts of a virtual DOM.

## Creating the data structures
So we're aiming to have a way to create DOM elements from some JavaScript Objects (not quite JSON since we want to be able to pass functions to event handlers).

Generally speaking each element is made up of a node type (div, span, h1, etc), a map of attributes {class, src, href, onclick, onmousemove, etc} and a list of child elements.

By convention the map of attributes is called `props` however this could be called anything we want. In fact we could separate out plain value attributes from event handlers, but we'll keep them all together in this case.

Let's start with the most basic example.
```typescript
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

// Example header element.
const header: ObjectElement = {
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
So our create function needs to take an `Element` and turn it into a `HTMLElement`.

How do we create an element in the DOM with the DOM API?

1. The `document` object, is our main entry point to creating new elements to add to the document.
2. There are two functions on the `document` object for creating elements `createTextNode` for text only nodes and `createElement` for all other nodes.
3. After the node has been created we actually need to attach it somewhere in the `document`. By default the `document` always has a `body`.
4. Done!

So let's put that into practice with our own `create` function.

```typescript
function create(element: Element): HTMLElement | Text
{
    // Check for string element
    if (typeof(element) === 'string')
    {
        // The DOM already has a function for creating text nodes which is returned as type Text.
        return document.createTextNode(element);
    }

    // The createElement function accepts the node type as a string, which is returned as type HTMLElement.
    const domElement = document.createElement(element.type);

    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in element.props)
    {
        // setAttribute is used for any attribute on an element such as class, value, src, etc.
        domElement.setAttribute(prop, element.props[prop]);
    }

    // Append all child elements.
    for (const child of element.children)
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
```

Let's also create a helper function for creating the virtual DOM elements

```typescript
function vdom(type: string, props: Props, ...children: VirtualElement[])
{
    return { type, props, children };
}
```

## What's the difference between a Node and an Element?
So the terms **node** and **element** have come up but what's the difference between them?

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