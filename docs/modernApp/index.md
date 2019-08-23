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

**My context for why**
This section is going to be biased towards explaining the 'why' for state management in a Redux style for a React like UI framework, however I'm sure that the basics for 'why' state management apply pretty universally.

When I first encountered Redux I was pretty put off by it. It seemed overly complicated with it's multiple files for actions, action types and reducers. It used a bunch of terminology I'd never heard of before, what even is a 'reducer'?. On top of that was expecting that every little UI change should result in a duplication of all the info in the web app triggering a full render (admittedly for a React like UI). However it did promise that more advanced features such as undo and redo would be a breeze to implement, along with restoring from localStorage. That seemed like a hard sell and so for a while I didn't touch it.

However as I went back to my current style of creating web apps using jQuery and using the jQuery plugin pattern for state management the killer features of being able to implement undo and redo along with being able to reload the page from localStorage without loosing data was becoming more appealing. I tried my hand at creating my own overly complicated 'command action' system that had each action keep track of what it did so you could undo it. It sort of worked for simple stuff but when it came to manipulating tables of data it just fell apart.

So I took another look at Redux and implemented the basic functionality using actions and reducers and combined those reducers in probably poor ways but things were working and just as advertised as it started to click adding in undo, redo and restore from localStorage was actually easy. Mistakes were still made however those were more on me.