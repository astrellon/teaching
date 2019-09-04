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