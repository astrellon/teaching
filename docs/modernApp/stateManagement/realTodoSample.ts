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