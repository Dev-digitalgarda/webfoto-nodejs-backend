import * as dree from 'dree';

import { Driver } from './driver';

export class DahuaDriver extends Driver {
    protected readonly name = 'dahua';

    public async analyze(): Promise<void> {
        const tree = await dree.scanAsync(this.path, {
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
        console.log(JSON.stringify(tree, null, 2));
    }
}
