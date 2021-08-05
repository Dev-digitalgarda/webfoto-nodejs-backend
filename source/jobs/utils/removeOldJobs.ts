import { Queue } from 'bullmq';

export async function removeOldJobs(queue: Queue, jobName: string): Promise<void> {
    const oldJobsKeys = (await queue.getRepeatableJobs()).filter(j => j.name === jobName).map(j => j.key);
    for (const oldJobKey of oldJobsKeys) {
        await queue.removeRepeatableByKey(oldJobKey);
    }
}
