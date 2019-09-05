# Creating a modern web app from scratch
Lets create a modern web app but we’re going to create the main components from scratch and we’re going to use Typescript and Parcel Bundler to do it.

We’re going to tackle state management, JSX (JavaScript XML) and why these patterns are used.

- [Let’s create a basic state management without and UI](#basic-state-management).
- [Let’s create a basic virtual DOM UI library without JSX](#basic-virtual-dom-ui).
- [Let’s add JSX support](#add-jsx-support-to-our-virtual-dom-ui).
- [Let's make a fully working Todo app](#combining-it-all-together-in-a-todo-app).

## Basic state management

### What
In relation to web dev state management is simply how the information about the web app is stored.

Very early on in web apps state management was given little thought as most web sites had limited functionality. As seen [here](https://www.javaworld.com/article/2077176/using-javascript-and-forms.html) in an article from 1996 JavaScript is being used to pull and change data on form input elements before the data is sent to the server in a format similar to URL parameters ([more info on MDN about form data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_and_retrieving_form_data)).

Whilst this wouldn't be recommended by today's standards it does show an example of state management. The state is being stored on the form input elements and updating those values updates the UI and conversely clicking the submit button allows for the JavaScript to pull data off those elements and do validations.

Today state management has been made somewhat more complicated but not usually without good reason. Some of the popular *stand alone* packages for state management these days are [Redux](https://www.npmjs.com/package/redux), [MobX](https://www.npmjs.com/package/mobx) and [Immer](https://www.npmjs.com/package/immer). However there are many more, often closely paired with a particular UI framework. Redux and React are frequently paired, however they can be used quite well independently.

A common feature between all of these modern state management frameworks is their size. They often tout just how few kilobytes they use which is always good but should lead to another conclusion, that under the hood state management is actually fairly simple in terms of the amount of code. That's not to say that these frameworks are pointless or that it doesn't matter which one you pick (if any) but that these frameworks are knowable. Hopefully if you don't already have an idea about how modern state management is generally constructed after reading these pages you'll have a better idea about what they're all about.

### Why

#### My Context For Why
Up until I was introduced to Redux I hadn't given much thought to good state management. I was using jQuery plugins for my UI and for storing state, which for small projects was working well enough.

It was when I was tasked with creating a UI for entering complex data with dynamic rows and columns and needing the ability to undo, redo and support not loosing data when the tab is accidentally closed that I started to take Redux more seriously.

Even though I had a degree in computer science and was fairly comfortable with the idea of pure functions, immutable data structures and creating testable code in languages like C# and C++, I was less familiar with applying those concepts to front end development beyond simple unit tests.

#### My Reasons For Why
State management is the application of good computer science fundamentals. It takes lessons learned about functional code, immutable data structures and applies to how a web app should be structured.

As such good state management is about making it testable and making use of functional code that will behave predictably. Of course state management isn't defined by it's use of functional code nor immutable data structures but they are well suited to it.

Good state management generally fits into the [Model-View-ViewModel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) or MVVM pattern. That's not the most elegant name but it essentially talks about creating a separation between how the data is stored, how the data should be displayed and then the display itself. The key part being the *how the data should be displayed*. The layer between the data and the display allows for multiple different displays for the same data as well the display code not needing to be tied to a specific data set either.

In practice rigid application of these patterns rarely happens but they are usually the basis for the reasons behind why code is put in certain places.

### Creating our own state management
[Here](./createStateManagement.md) is an example of creating basic state management. Feel free to skip this part if you're already comfortable with state management.

## Basic Virtual DOM UI

### What is a DOM?
Firstly a quick note on what a [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) is. DOM stands for Document Object Model and it is the way that a web page is defined. It basically defines that a web page is a document and that the document is structured like a [tree](https://en.wikipedia.org/wiki/Tree_\(data_structure\)), where a node can have multiple children and attributes.

So how does HTML come into this?

HTML is a text representation a DOM. Just like JSON it is simply a format. In theory a JSON compatible format could be used to write web pages should a browser implement that.

A simple example of a parent child element.
```html
<div>
    <strong>Note: </strong> Important Information.
</div>
```

The `div` parent element contains two children, the `strong` element and then a plain text node. In some cases the white space before the `strong` node might be included as a text node with white space.

### What is a Virtual DOM
It's a way of representing the DOM but in a lightweight way. Under the hood nearly all virtual DOM implementations use simple JavaScript objects as representations and will keep track of the previous render's virtual DOM. Using the previous virtual DOM a diff between the virtual DOMs can be made and only the changes that actually need to be applied.

Just like with HTML these JavaScript objects are used to represent DOM elements however being objects they can be created, manipulated and handled in JavaScript much easier than HTML. That said many virtual DOM implementations used JSX which makes creating these virtual DOM elements using a syntax that looks a lot like HTML, more on that in the next section.

**Note:** The feature of applying only the differences between each render is not a core requirement of a virtual DOM, just a common feature between implementations.

### Why
As DOM elements in the browser are quite heavy in both memory usage and CPU processing time minimising how many are created is optimal. Creating an element can also trigger a recalculation of the layout which depending on the complexity of the UI that can also be a slow process.

A virtual DOM is like another format that sits on-top of the DOM and is specifically used to apply changes to the DOM in bulk. As updating the DOM will nearly always trigger a recalculation of the layout you want to make as many changes in one go as possible and having a central piece of code that handles doing that helps with reducing unnecessary DOM updates.

It is very much possible to create a virtual DOM using HTML, to some degree that's how older frameworks used to work. Using string templates (such as [Mustache](http://mustache.github.io/)) to create a HTML string and then giving that to the browser to turn into elements. This generally has widespread support from the browsers and gives the developer full access to all the HTML attributes out of the box. However it has the major downsides of doing any sort of additional manipulation of elements during creation is quite hard and linking JavaScript event handlers to strings requires a bunch of hoops. Doing a diff between big strings makes it hard to know what actually changes without turning that string into a data structure that can be handled in JavaScript directly. Which sort of leads to us to where virtual DOM frameworks are today, skipping straight to the JavaScript object representation.

### Create our own Virtual DOM
[Here](./createVirtualDom.md) is a very basic example of creating our own virtual DOM. Feel free to skip this part if you're already comfortable with virtual DOMs.

## Add JSX support to our Virtual DOM UI

### What
JSX allows creating virtual nodes in a syntax that looks like HTML/XML but actually get converted to plain function calls. Making it easier to create UI elements in a format that is understandable whilst keeping the flexibility of JavaScript/TypeScript.

At this time JSX is **NOT** supported in the browser, as such it needs an additional build step for supporting it.

```tsx
// Example of creating an app using a virtual DOM function (vdom).
const appVDom = vdom('main', {},
    vdom('h1', {}, 'Header'),
    vdom('p', {},
        vdom('strong', {}, 'A button'),
        vdom('button', { onclick: onClickButton }, 'Button Text'),
        vdom('span', {}, `Button clicked ${buttonClickTimes} times`)
    )
);

// Example of creating the same* app but using JSX.
const appJsx = <main>
    <h1>Header</h1>
    <p>
        <strong>A button</strong>
        <button onclick={onClickButton}>Button Text</button>
        <span>{`Button clicked ${buttonClickTimes} times`}</span>
    </p>
</main>;

//*: So for the sack of formatting the JSX example will actually
//   contain whitespace between each element whereas the first
//   example does not contain the whitespace.
```

Actually accounting for number of characters written the JSX example isn't really any better but it should be more readable.

### Why
The reasons for using JSX over directly using the virtual DOM calls (in React that is `React.createElement`) is for readability.

It does require another build step however given that it now has fairly widespread support across various build systems. Generally if the web app is complex enough to warrant using a UI framework like React then the additional readability of JSX should also be used.

### Add JSX support to the Virtual DOM.
[Here](./addingVirtualDomJsxSupport.md) is further details about how to add JSX support to our virtual DOM framework.

## Combining it all together in a Todo app
Alright we've now created our own state management, a virtual DOM framework and added JSX support for that framework.

Let's see if we can create a very basic Todo app with it all.

[Here](./createTodoApp.md) is the further details about this.

## Conclusion
Hopefully at this point some of these simple building blocks for many modern apps are a bit demystified.

The state management we've created is pretty robust (and simple) and can easily be used to create non-trivial webapps. It might not have the extra devtools like Redux-DevTools which is a shame, but failing that it does a lot with not much.

The virtual DOM framework is very barebones, full blown virtual DOM frameworks usually have a fair bit more to them. For one not removing all the existing elements and starting again each time, for one there will likely be problems with input elements if they are managed by the state. However at their core they're about representing the DOM in a way that can be easily processed by JavaScript and adding JSX support isn't as complicated as it might seem. However for full JSX TypeScript support it can take some time creating all the interfaces for all the different elements.

Let me know if things still don't make sense or if my explanations of why don't add up on my [Twitter](https://twitter.com/Alan_Lawrey) or by [email](mailto:alan.lawrey@gmail.com)