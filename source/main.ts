import './utils/moduleAlias';

import * as express from 'express';
import { Loader } from '@/loaders';
import router from '@/api';
import logger from '@/utils/logger';
import { CONFIG, SETTINGS } from '@/config';
import { DahuaDriver } from './drivers/dahua';

async function startServer(): Promise<void> {
    logger.hr();
    logger.warning('WEBFOTO API');

    const app = express();

    const loader = new Loader(app, router);
    loader.loadMiddlewares();
    loader.loadRouter();
    loader.loadErrorHandler();
    // await loader.loadJobs();

    logger.info('Starting server...');
    const port = CONFIG.SERVER.PORT;
    app.listen(port, () => {
        logger.success(`Server listening on port ${port}`);
        logger.hr();
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
startServer();

const d = new DahuaDriver(SETTINGS.find(s => s.driver === 'DAHUA')?.inputPath as string);
d.analyze();
