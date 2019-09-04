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
