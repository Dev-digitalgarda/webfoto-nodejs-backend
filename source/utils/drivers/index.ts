import dahuaDriver from './implementations/dahua.driver';

export interface InputImage {
    path: string;
    timestamp: Date;
    sizeInBytes: number;
    sizeHumanReadable: string;
}

export type Driver = (path: string) => Promise<InputImage[]>;

export const DRIVERS: Record<string, Driver> = {
    dahua: dahuaDriver
};
