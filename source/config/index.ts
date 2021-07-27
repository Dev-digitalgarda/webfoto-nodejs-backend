/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';
import * as path from 'path';

declare const process: {
    env: Record<string, string | undefined>;
    cwd: () => string;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires,  @typescript-eslint/no-require-imports
const packageJson = require(path.join(process.cwd(), 'package.json'));

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    SERVER: {
        PORT: process.env.SERVER_PORT ?? 3000
    },
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT
    },
    LOGGER: {
        DEBUG: process.env.LOGGER_DEBUG === 'true'
    },
    API_VERSION: packageJson.version
};

export default CONFIG;
