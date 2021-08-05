import { Router } from 'express';
import logger from '@/utils/logger';

import albumsRouter from './routes/albums/albums.route';
import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/albums');
    router.use('/albums', albumsRouter());

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
