import * as fs from 'fs';
import * as util from 'util';
import * as moveFile from 'move-file';

export const move = moveFile;
export const unlink = util.promisify(fs.unlink);
export const exists = util.promisify(fs.exists);
export const mkdir = util.promisify(fs.mkdir);
export const stat = util.promisify(fs.stat);
export const readdir = util.promisify(fs.readdir);
export const copyFile = util.promisify(fs.copyFile);
export const writeFile = util.promisify(fs.writeFile);
