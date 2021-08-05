import { Router } from 'express';

import { InvalidPathParamError } from '@/errors/client/InvalidPathParamError';
import databseService from '@/service/databse.service';

import asyncHandler from '@/utils/asyncHandler';
import { InvalidQueryParamError } from '@/errors/client/InvalidQueryParamError';

function extractSingleQueryParam(parameter: undefined | string | string[]): string | undefined {
    if (Array.isArray(parameter)) {
        return parameter.length > 0 ? parameter[parameter.length - 1] : undefined;
    } else {
        return parameter;
    }
}
function extractOptionalDateQueryParam(parameter: undefined | string | string[], name = ''): Date | undefined {
    const paramValue = extractSingleQueryParam(parameter);

    if (paramValue === undefined) {
        return undefined;
    }

    const result = new Date(paramValue);
    if (Number.isNaN(+result)) {
        throw new InvalidQueryParamError(`${name} query paramValue should be a valid ISO date.`, {
            name,
            value: paramValue
        });
    }

    return result;
}

function validateStringParam(param: any, name = '') {
    if (!param || typeof param !== 'string') {
        throw new InvalidPathParamError(`Album ${name} not found`, {
            name,
            value: param
        });
    }
}

function extractFromAndToDate(queryParams: any): { from: Date | undefined; to: Date | undefined } {
    const { from, to } = queryParams;

    return {
        from: extractOptionalDateQueryParam(from),
        to: extractOptionalDateQueryParam(to)
    };
}

export default function (): Router {
    const router = Router();

    router.get(
        '/:album/images',
        asyncHandler(async (req, res) => {
            const album = req.params.album;
            const queryParams = req.query;

            validateStringParam(album, 'album');
            const { from, to } = extractFromAndToDate(queryParams);

            const images = await databseService.getImages(album, from, to);
            res.json(images);
        })
    );

    return router;
}
