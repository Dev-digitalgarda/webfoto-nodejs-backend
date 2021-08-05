/* eslint-disable @typescript-eslint/no-unused-vars */
import { Job, Queue, Worker, QueueScheduler } from 'bullmq';

import logger from '@/utils/logger';
import { CONFIG, SETTINGS } from '@/config';

import { executeJob } from './utils/executeJob';
import { removeOldJobs } from './utils/removeOldJobs';

export class Jobs {
    private readonly connection: any;
    private readonly queueName = 'jobs';
    private readonly queue: Queue;

    constructor() {
        this.connection = {
            host: CONFIG.REDIS.HOST,
            port: CONFIG.REDIS.PORT
        };

        this.queue = new Queue(this.queueName, {
            connection: this.connection
        });

        const _queueScheduler = new QueueScheduler(this.queueName, { connection: this.connection });
    }

    public loadJobs(): void {
        const _worker = new Worker(
            this.queueName,
            async (job: Job) => {
                try {
                    logger.info('Executing job', job.name);

                    const setting = SETTINGS.find(s => s.name === job.name);

                    if (setting) {
                        await executeJob(setting);
                    }

                    logger.success('Finished job', job.name);
                } catch (error) {
                    logger.error(`Error executing job ${job.name}`, error);
                }
            },
            { connection: this.connection }
        );
    }

    public async addJobs(): Promise<void> {
        for (const setting of SETTINGS) {
            logger.debug('Adding job', setting.name);
            await removeOldJobs(this.queue, setting.name);
            await this.queue.add(setting.name, null, { repeat: { cron: setting.analyzeCrono } });
        }
    }
}
export default new Jobs();
