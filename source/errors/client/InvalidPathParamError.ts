import { BadRequestError } from './BadRequestError';

interface Details {
    name: string;
    value: string;
}

export class InvalidPathParamError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid path param';

    constructor(message = InvalidPathParamError.defaultMessage, param?: Details) {
        super(message, { param });
        this.name = 'InvalidPathParamError';
    }
}
