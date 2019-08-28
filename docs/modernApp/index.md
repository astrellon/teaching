# Creating a modern web app from scratch
Lets create a modern web app but we’re going to create the main components from scratch and we’re going to use Typescript and Parcel Bundler to do it.

We’re going to tackle state management, TSX (Typescript JSX) and why these patterns are used.

- Let’s create a basic state management without and UI.
- Let’s create a basic virtual DOM UI library without TSX.
- Let’s add TSX support.

## Basic state management

### What
In relation to web dev state management is simply how the information about the web app is stored.

Very early on in web apps state management was given little thought as most web sites had limited functionality. As seen [here](https://www.javaworld.com/article/2077176/using-javascript-and-forms.html) in an article from 1996 JavaScript is being used to pull and change data on form input elements before the data is sent to the server in a format similar to URL parameters ([more info on MDN about format data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_and_retrieving_form_data)).

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

### Creating our own state management
[Here](./createStateManagement.md) is an example of creating basic state management. Feel free to skip this part if you're already comfortable with state management.

## Basic Virtual DOM UI

### What is a DOM?
Firstly a quick note on what a DOM is. DOM stands for Document Object Model and it is the way that a web page is defined. It basically defines that a web page is a document and that the document is structured like a tree, where a node can have multiple children and attributes.

So how does HTML come into this?

HTML is a text representation a DOM. Just like JSON it is simply a format. In theory a JSON compatible format could be used to write web pages should a browser implement that.

A simple example of a parent child element.
```html
<div>
    <strong>Note: </strong> Important Information.
</div>
```

The `div` parent element contains two children, the `strong` element and then a plain text node. In some cases the white space before the `strong` node might be included as a text node with white space.

### What
It's a way of representing the DOM but in a lightweight way. As DOM elements in the browser are actually quite heavy, creating an element can trigger a recalculation of the layout which depending on the complexity of the UI that can be a slow process.

A virtual DOM is like another format that sits on-top of the DOM and is specifically used to apply changes to the DOM in bulk. As updating the DOM will nearly always trigger a recalculation of the layout you want to make as many changes in one go as possible and having a central piece of code that handles doing that helps with reducing unnecessary DOM updates.

Under the hood nearly all virtual DOM implementations use simple Javascript objects as representations and will keep track of the previous render's virtual DOM. Using the previous virtual DOM a diff between the virtual DOMs can be made and only the changes that actually need to be applied. However the feature of applying only the differences between each render is not a core requirement of a virtual DOM, just a common feature between implementations.
### Why

## Add TSX support to our Virtual DOM UI

### What

### Why