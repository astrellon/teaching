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