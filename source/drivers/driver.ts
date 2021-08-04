export abstract class Driver {
    protected path: string;

    protected abstract readonly name: string;

    constructor(path: string) {
        this.path = path;
    }

    public abstract analyze(): Promise<void>;
}
