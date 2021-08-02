import Ajv from 'ajv';

import * as settingsSchema from '@/config/settings.schema.json';

export function validateSettingsSchema(settingsObject: any): void {
    const ajv = new Ajv();
    const validate = ajv.compile(settingsSchema);

    if (!validate(settingsObject)) {
        console.warn(validate.errors);
        throw new Error('Provided settings are not valid');
    }
}
