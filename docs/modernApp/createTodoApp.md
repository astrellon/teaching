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

Now we need a simple way to render a todo item
```typescript
import "./vdom.ts"
```

## Example
[Here](./createTodoApp/deploy/index.html) is a final built example.