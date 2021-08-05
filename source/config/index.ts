/* eslint-disable @typescript-eslint/naming-convention */
import { validateSettingsSchema } from '@/utils/settingsValidator';
import * as dotenv from 'dotenv';
import * as path from 'path';

declare const process: {
    env: Record<string, string | undefined>;
    cwd: () => string;
};

export interface AlbumConfig {
    name: string;
    inputPath: string;
    driver: string;
    keepEverySeconds: number;
    analyzeCrono: string;
}

function getPath(address?: string, varName?: string): string {
    try {
        return path.join(process.cwd(), address as string);
    } catch (error) {
        console.warn('Error in config parsing, path not found', varName);
        throw error;
    }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires,  @typescript-eslint/no-require-imports
const packageJson = require(path.join(process.cwd(), 'package.json'));

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    SERVER: {
        PORT: process.env.SERVER_PORT ?? 3000
    },
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379
    },
    MONGODB: {
        URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        DATABASE: process.env.MONGODB_DATABASE
    },
    SETTINGS_PATH: getPath(process.env.SETTINGS_PATH, 'SETTINGS_PATH'),
    OUTPUT_FOTOS_PATH: getPath(process.env.OUTPUT_FOTOS_PATH, 'OUTPUT_FOTOS_PATH'),
    LOGGER: {
        DEBUG: process.env.LOGGER_DEBUG === 'true'
    },
    API_VERSION: packageJson.version
};

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
export const SETTINGS = require(CONFIG.SETTINGS_PATH) as AlbumConfig[];
validateSettingsSchema(SETTINGS);
