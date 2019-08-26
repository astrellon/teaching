# Creating a modern web app from scratch

Lets create a modern web app but we’re going to create the main components from scratch and we’re going to use Typescript and Parcel Bundler to do it.

We’re going to tackle state management, TSX (Typescript JSX) and why these patterns are used.

- Let’s create a basic state management without and UI.
- Let’s create a basic reactive UI library without TSX.
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