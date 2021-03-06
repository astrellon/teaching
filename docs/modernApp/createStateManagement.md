# Create basic state management
Here we're going to go over creating our own state management in the style of Redux but not Redux.

## Todo Example
Lets look at a simple todo app example. I'm going to forego any UI just use pure Typescript.

**NOTE** This is a starting point that introduces as few new concepts, as such it breaks some best practices that we'll address later.

```typescript
// Run using:
// $ ts-node firstTodoSample.ts

// Definition of types for state management.
interface TodoItem
{
    readonly text: string;
    readonly id: number;
}

interface State
{
    readonly todoItems: TodoItem[];
}

// Create our state management store
let state: State =
{
    todoItems: []
};

// Functions for manipulating the store.
function addItem(text: string, id: number)
{
    state = {
        todoItems: [...state.todoItems, {text, id}]
    }

    onStateChanged(state);
}

function removeItem(id: number)
{
    state = {
        todoItems: state.todoItems.filter(item => item.id !== id)
    }

    onStateChanged(state);
}

// Callback for the state changing.
function onStateChanged(state: State)
{
    console.log('New state:', state);
}

// Test calls
addItem('Rice', 1);
// console: New state: { todoItems: [ { text: 'Rice', id: 1 } ] }
addItem('Bread', 2);
// console: New state: { todoItems: [ { text: 'Rice', id: 1 }, { text: 'Bread', id: 2 } ] }

removeItem(1);
// console: New state: { todoItems: [ { text: 'Bread', id: 2 } ] }
```

That's the core of it! Now you might be thinking I've oversimplified it and yes I have because some amount of framework can make things easier. For one thing these functions aren't actually functional, each have to make sure they trigger the `onStoreChanged` function however under the hood you see that really the basic flow of state management is just that you have a way to trigger a change to your store and then a centralised way of being notified that the store has changed.

But now that we've done this not great but very simplistic version, what should we really be doing for state management?

## A Better Todo Example
First off let's look at the core of the state management, we want to be able to manipulate the store in a more centralised way. I'm also going to start using some more Typescript specific code, generally speaking if you are unfamiliar with Typescript the only things to note are that `<TState>` means you can specify what that type is when you create the store.

Lets also put things in files:

```typescript
// store.ts

export class Store<TState>
{
    // This should be private, however for briefing we'll allow direct access
    // for debugging and clean it up at the end.
    public state: TState;

    constructor(initialState: TState)
    {
        this.state = initialState;
    }
}
```

Seems pretty simple so far, we've just wrapped the store into it's own class and chucked the state into it.

Now if we want to change the state without modifiying the existing state, we just need to use functions that take the current state and return a new one without modifying the current one. This does look a lot like the `addItem` functions from the first example

```typescript
function addItem(state: State, text: string, id: number): State
{
    return {
        todoItems: [...state.todoItems, {text, id}]
    }
}
```

A fairly small change, but the main difference being that if you give it the same input state, text and id, you will always get the same output state.

Okay great we have a function that will add an item to a state, but how do we actually use it? A good question, we want the `Store` class to have a way of executing one of these functions. So let's add that.

```typescript
// store.ts

// Function type for modifying a state from an old state into a new state.
export type Modifier<TState> = (state: TState) => TState;

class Store<TState>
{
    // ... existing constructor code here

    public execute(modifier: Modifier<TState>)
    {
        this.state = modifier(this.state);
    }
}
```

Alright we have a modifier function that takes the current state and returns a new one (we'll skip any validation that we have a new non-null state for now). But the `addItem` function wants the state, text and id not just the state.

Looks like we need to tweak the `addItem` function!

```typescript
function addItem(text: string, id: number): Modifier<State>
{
    return (state: State) =>
    {
        return {todoItems: [...state.todoItems, {text, id}]}
    }
}
```

Okay, this is starting to look a bit more complicated, but we'll break it down. We're back to having to just give the `text` and `id` to add a todo item, but the `addItem` function now returns another function? Correct! The `addItem` function now returns a function that makes the change we want to the state, we get to call it with the arguments we care about (text and id) and it in returns gives a function that the store cares about (old state in, new state out).

So let's see this in use.

```typescript
const store = new Store<State>({todoItems: []});

store.execute(addItem('Rice', 1));
store.execute(addItem('Bread', 2));

console.log('Store state: ', store.state);
// console: Store state: { todoItems: [ { text: 'Rice', id: 1 }, { text: 'Bread', id: 2 } ] }
```

Alright that looks familiar, we can now add new items through a centralised `execute` function.

Let's go ahead and add a callback function so that we can keep track of when the store changes.

```typescript
// store.ts

// Function type for modifying a state from an old state into a new state.
export type Modifier<TState> = (state: TState) => TState;

// Subscription function, this will be triggered when the store changes.
export type Subscription<TState> = (state: TState) => void;

export class Store<TState>
{
    // This can be private now that we have a way to get the state otherwise.
    private state: TState;
    private subscriptions: Subscription<TState>[];

    constructor(initialState: TState)
    {
        this.state = initialState;
        this.subscriptions = [];
    }

    public getState()
    {
        return this.state;
    }

    public execute(modifier: Modifier<TState>)
    {
        const newState = modifier(this.state);
        this.state = newState;

        for (const subscription of this.subscriptions)
        {
            // It might be possible for a subscription to trigger another execute
            // which will modify the state again, so we'll make sure to always pass
            // the same new state to all subscriptions each call.
            subscription(newState);
        }
    }

    public subscribe(subscription: Subscription<TState>)
    {
        this.subscriptions.push(subscription);
    }
}
```

That's the basis of our store! There are some nice things we can add like a way to remove a subscription, add features for history support, add some sort of way of customising how a subscription is triggered like only when a specific part of the store changes. Those are all features on top of the core of this state management.

You can find the final code [here](./stateManagement/store.ts).

**The Real Todo Example**
So we've created our state management store now let's use it for real.

```typescript
import { Store, Modifier } from "./store";

// Definition of types for state management.
interface TodoItem
{
    readonly text: string;
    readonly id: number;
}

interface State
{
    readonly todoItems: TodoItem[];
}

// Create our state management store
const initialState: State = { todoItems: [] };
const store = new Store<State>(initialState);

// Functions for manipulating the store.
function addItem(text: string, id: number): Modifier<State>
{
    return (state: State) =>
    {
        return { todoItems: [...state.todoItems, { text, id }] };
    }
}

function removeItem(id: number): Modifier<State>
{
    return (state: State) =>
    {
        return { todoItems: state.todoItems.filter(item => item.id !== id) };
    }
}

// Callback for the state changing.
function onStateChanged(state: State)
{
    console.log('New state:', state);
}
store.subscribe(onStateChanged);

// Test calls
store.execute(addItem('Rice', 1));
// New state: { todoItems: [ { text: 'Rice', id: 1 } ] }
store.execute(addItem('Bread', 2));
// New state: { todoItems: [ { text: 'Rice', id: 1 }, { text: 'Bread', id: 2 } ] }

store.execute(removeItem(1));
// New state: { todoItems: [ { text: 'Bread', id: 2 } ] }
```

We now have a store where we can keep track of when it changes, we can use that save and restore from localStorage if we want and adding support for undo and redo is not much work. We can add these in another lesson but for now this is the core of most state management frameworks, especially Redux.