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
            // It might be possible for a subscription to trigger another execute which will modify the state again, so we'll make sure to always pass the same new state to all subscriptions everytime.
            subscription(newState);
        }
    }

    public subscribe(subscription: Subscription<TState>)
    {
        this.subscriptions.push(subscription);
    }
}