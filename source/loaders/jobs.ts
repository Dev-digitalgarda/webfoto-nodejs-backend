import jobs from '@/jobs';
import logger from '@/utils/logger';

export default async function loadJobs(): Promise<void> {
    logger.debug('Initialize jobs');
    jobs.loadJobs();
    logger.debug('Add jobs');
    await jobs.addJobs();
}
