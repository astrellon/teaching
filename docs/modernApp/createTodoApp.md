# Creating a Todo App
Time to put all the bits together with our state management and JSX enabled virtual DOM!

## What is a Todo App?
Before we jump into making a Todo let's quickly go over what one is.

### Basic design
A Todo app is generally made up of these features:

* Display a list of todo items.
* Create a todo item.
* Clear a todo item.
* Keep track of items between session loading. eg save to localStorage.

So we're going to need a way to describe a single item and how to store multiple items.

You might notice that this basically the exact same store as in our create state management section.

```typescript
// todoAppStore.ts
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
export const todoAppStore = new Store<State>(initialState);

// Functions for manipulating the store.
export function addItem(text: string, id: number): Modifier<State>
{
    return (state: State) =>
    {
        return { todoItems: [...state.todoItems, { text, id }] };
    }
}

export function removeItem(id: number): Modifier<State>
{
    return (state: State) =>
    {
        return { todoItems: state.todoItems.filter(item => item.id !== id) };
    }
}
```

### Rendering a single Todo item

Now we need a simple way to render a todo item
```tsx
import { vdom } from "./vdom";
import { todoAppStore, removeTodoItem, TodoItem } from "./todoAppStore";

function removeItem(id: number)
{
    todoAppStore.execute(removeTodoItem(id));
}

export function TodoItemView(props: { item: TodoItem })
{
    return <div>
        <strong>{props.item.text}</strong>
        <button onclick={() => removeItem(props.item.id)}>Remove</button>
    </div>
}
```

### Rendering a list of Todo items
Whilst a component just to render a list of items isn't strictly required,
it does give us some extra ability to handle the situation of no items in an easier fashion.

```tsx
import { vdom } from "./vdom";
import { TodoItem } from "./todoAppStore";
import { TodoItemView } from "./todoItem";

export function TodoItemList(props: { items: TodoItem[] })
{
    const { items } = props;

    if (items.length === 0)
    {
        return <strong>No items</strong>;
    }

    // Note! Our vdom does not support returning a list of nodes to create.
    return <div>
        { items.map(item => <TodoItemView item={item} />) }
    </div>;
}
```

### Creating the top level App component

```tsx
import { vdom } from "./vdom";
import { State, todoAppStore, addTodoItem } from "./todoAppStore";
import { TodoItemList } from "./todoItemList";

function addItem()
{
    const newItemText = prompt('New item text:');
    if (newItemText)
    {
        todoAppStore.execute(addTodoItem(newItemText));
    }
}

export function App(props: {state: State})
{
    const { state } = props;

    return <main>
        <h1>Todo App</h1>
        <p>
            <button onclick={addItem}>Add Item</button>
        </p>
        <p>
            <TodoItemList items={state.todoItems} />
        </p>
    </main>;
}
```

### Index TypeScript file

```tsx
import { vdom, render } from "./vdom";
import { todoAppStore, State } from "./todoAppStore";
import { App } from "./app";

function renderApp(state: State)
{
    const rootElement = document.getElementById('root');
    render(<App state={state} />, rootElement);
}

// Render the app on start
renderApp(todoAppStore.getState());

// Re-render the app when the store changes
todoAppStore.subscribe((state) =>
{
    renderApp(state);
});
```

### Updating Store to support localstorage

```typescript
import { Store, Modifier } from "./store";

// Definition of types for state management.
export interface TodoItem
{
    readonly text: string;
    readonly id: number;
}

export interface State
{
    readonly todoItems: TodoItem[];
    readonly nextItemId: number;
}

const localStorageKey = 'todoApp';
const defaultState: State =
{
    todoItems: [],
    nextItemId: 0
};

let enableLocalStorage = true;
let initialState: State = defaultState;
// The try catch is to handle any exceptions that can occur
// when using localStorage, such as a lack of permissions.
try
{
    // Check if we have any localStorage already.
    if (localStorage[localStorageKey])
    {
        const existingState = JSON.parse(localStorage[localStorageKey]);
        if (existingState != undefined)
        {
            // Combine the default state with the new existing state.
            initialState = {
                ...defaultState,
                ...existingState
            };
        }
    }
}
catch (error)
{
    enableLocalStorage = false;
    console.log('Unable to load from localStorage', error);
}

// Create our state management store
export const todoAppStore = new Store<State>(initialState);

// Save state after each change to localStorage
todoAppStore.subscribe(state =>
{
    try
    {
        if (enableLocalStorage)
        {
            localStorage[localStorageKey] = JSON.stringify(state);
        }
    }
    catch (error)
    {
        console.log('Error updating localStorage', error);
    }
});

// Functions for manipulating the store.
export function addTodoItem(text: string): Modifier<State>
{
    return (state: State) =>
    {
        const id = state.nextItemId + 1;
        return {
            ...state,
            todoItems: [...state.todoItems, { text, id }],
            nextItemId: id
        };
    }
}

export function removeTodoItem(id: number): Modifier<State>
{
    return (state: State) =>
    {
        return {
            ...state,
            todoItems: state.todoItems.filter(item => item.id !== id)
        };
    }
}
```

## Example
[Here](./createTodoApp/deploy/index.html) is a final built example.