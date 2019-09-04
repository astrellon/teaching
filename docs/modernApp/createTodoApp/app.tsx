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