import { BadRequestError } from './BadRequestError';

interface Details {
    name: string;
    value: string;
}

export class InvalidQueryParamError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid path param';

    constructor(message = InvalidQueryParamError.defaultMessage, param?: Details) {
        super(message, { param });
        this.name = 'InvalidQueryParamError';
    }
}
