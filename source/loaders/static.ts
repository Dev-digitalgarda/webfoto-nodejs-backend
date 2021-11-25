import * as express from 'express';
import { Express } from 'express';

import logger from '@/utils/logger';
import { CONFIG } from '@/config';

export default function loadStatic(app: Express): void {
    logger.debug('Load static files');
    app.use(express.static(CONFIG.OUTPUT_FOTOS_PATH));
}
