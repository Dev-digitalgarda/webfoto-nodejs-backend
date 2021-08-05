import * as path from 'path';

import databaseService, { Image } from '@/service/databse.service';
import { unlink, move, writeFile } from '@/utils/fsAsync';
import { DRIVERS, InputImage } from '@/utils/drivers';
import { AlbumConfig, CONFIG } from '@/config';

function getNextMinimumTimestamp(timestamp: Date | null, keepEverySeconds: number): Date | null {
    return timestamp === null ? null : new Date(+timestamp + keepEverySeconds * 1000);
}

function getImageName(name: string, timestamp: Date): string {
    return `${name}_${timestamp.toISOString()}.jpg`;
}

function imageFromInputImage(name: string, destination: string, inputImage: InputImage): Image {
    const imageName = getImageName(name, inputImage.timestamp);
    return {
        name,
        path: path.join(destination, imageName),
        timestamp: inputImage.timestamp,
        sizeInBytes: inputImage.sizeInBytes,
        sizeHumanReadable: inputImage.sizeHumanReadable
    };
}

export async function executeJob(setting: AlbumConfig): Promise<void> {
    const lastAlbumTimestamp = await databaseService.getLastAlbumTimestamp(setting.name);
    const destination = path.join(CONFIG.OUTPUT_FOTOS_PATH, setting.name);

    const driver = DRIVERS[setting.driver];
    const images = await driver(setting.inputPath);

    const toDeleteImages: InputImage[] = [];
    const toSaveImages: InputImage[] = [];

    let log = [] as string[];
    log.push('lastAlbumTimestamp ' + (lastAlbumTimestamp ? lastAlbumTimestamp.toISOString() : 'null'));

    let currentLastTimestamp = getNextMinimumTimestamp(lastAlbumTimestamp, setting.keepEverySeconds);
    for (const image of images) {
        log.push(`currentLastTimestamp ${currentLastTimestamp ? currentLastTimestamp.toISOString() : 'null'}`);
        log.push(`image.timestamp ${image.timestamp ? image.timestamp.toISOString() : 'null'}`);
        if (currentLastTimestamp === null || image.timestamp >= currentLastTimestamp) {
            log.push('save');
            toSaveImages.push(image);
            currentLastTimestamp = getNextMinimumTimestamp(image.timestamp, setting.keepEverySeconds);
        } else {
            log.push('delete');
            toDeleteImages.push(image);
        }
    }

    await writeFile('log.json', log.join('\n'));

    console.log('TO DELETE');
    const first = toDeleteImages.map(el => el.timestamp);
    const firstText = JSON.stringify(toDeleteImages, null, 2);
    console.log(first.length);
    await writeFile('first.json', firstText);

    console.log('TO SAVE');
    const second = toSaveImages.map(el => el.timestamp);
    const secondText = JSON.stringify(toSaveImages, null, 2);
    console.log(second.length);
    await writeFile('second.json', secondText);

    const toDeleteImagesPromises = toDeleteImages.map(async image => unlink(image.path));
    const toSaveImagesPromises = toSaveImages.map(async image => {
        const toSaveImg = imageFromInputImage(setting.name, destination, image);
        await databaseService.insertImage(setting.name, toSaveImg);
        await move(image.path, toSaveImg.path);
    });

    await Promise.all([...toDeleteImagesPromises, ...toSaveImagesPromises]);

    console.log('done');
}
