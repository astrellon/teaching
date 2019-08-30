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

    // Our properties/attributes are just a map of string keys to any value at the moment.
    props: { [key: string]: any };

    // Children can be text or another object element.
    // We need the text special type otherwise we wouldn't have a way to specify text.
    children: Element[];
}

// An element is either the object above or plain text.
type Element = ObjectElement | string;

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

### A render function
So our render function needs to take an `Element` and turn it into a `HTMLElement`.

```typescript
function render(element: Element): HTMLElement
{
    // Check for string element
    if (typeof(element) === 'string')
    {
        return document.createTextNode(element);
    }

    const domElement = document.createElement(element.type);
    // Add all attributes to the element.
    // No handling of event handlers for now.
    for (const prop in element.props)
    {
        domElement.setAttribute(prop, element.props[prop]);
    }

    // Append all child elements.
    for (const child of element.children)
    {
        domElement.append(render(child));
    }

    return domElement;
}
```

Now we should be able to use the function just like this.

```typescript
const domElement = render(header);
document.body.append(domElement);
```