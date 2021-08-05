import * as dree from 'dree';
import { Type, Dree } from 'dree';

import logger from '@/utils/logger';

import { InputImage } from '..';

function extractDate(filename: string): Date | null {
    try {
        const datePart = filename.split('[')[0];

        const year = +datePart.slice(0, 4);
        const month = +datePart.slice(4, 6);
        const date = +datePart.slice(6, 8);
        const hours = +datePart.slice(8, 10);
        const minutes = +datePart.slice(10, 12);
        const seconds = +datePart.slice(12, 14);

        return new Date(Date.UTC(year, month - 1, date, hours, minutes, seconds));
    } catch (error) {
        logger.warning(`Invalid filename ${filename}`, error);
        return null;
    }
}

function analyzeTree(tree: Dree, images: InputImage[]): void {
    switch (tree.type) {
        case Type.DIRECTORY:
            for (const child of tree.children as Dree[]) {
                analyzeTree(child, images);
            }
            break;
        case Type.FILE:
            const timestamp = extractDate(tree.name);

            if (timestamp !== null && !Number.isNaN(+timestamp)) {
                images.push({
                    path: tree.path,
                    timestamp,
                    sizeInBytes: tree.sizeInBytes as number,
                    sizeHumanReadable: tree.size as string
                });
            }

            break;
    }
}

export default async function (path: string): Promise<InputImage[]> {
    const images: InputImage[] = [];

    const tree = await dree.scanAsync(path, {
        extensions: ['jpg'],
        hash: false,
        normalize: true,
        size: true,
        sizeInBytes: true,
        stat: false,
        symbolicLinks: false,
        showHidden: false,
        sorted: true,
        skipErrors: false,
        followLinks: false
    });

    analyzeTree(tree, images);

    return images;
}
