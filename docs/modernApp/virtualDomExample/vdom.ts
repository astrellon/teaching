// How we want our virtual elements to look like
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

// Our properties/attributes are just a map of string keys to any value at the moment.
interface Props
{
    [key: string]: any;
}

// A virtual node is either and element above or plain text.
export type VirtualNode = VirtualElement | string;
export type CreateNode = (props: Props) => VirtualNode;
export type VirtualNodeType = string | CreateNode;

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

// Renders the given virtualNode into the given parent node.
// This will clear the parent node of all its children.
export function render(virtualNode: VirtualNode, parent: Node)
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

// Helper function for creating virtual DOM object.
export function vdom(type: VirtualNodeType, props: Props, ...children: VirtualNode[]): VirtualElement
{
    return { type, props, children };
}