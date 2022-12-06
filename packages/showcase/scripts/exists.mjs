import { findComponents, toStoryFile } from './common.mjs';
import { stat } from 'node:fs/promises';
import { sep } from 'node:path';

const components = await findComponents();
const storyFiles = components.map(toStoryFile);

let missing = 0;

for (const file of storyFiles) {
    try {
        const f = await stat(file);
        if (f.isFile()) {
            console.info(`Story ${file.split(sep).pop()} exists as expected.`);
        } else {
            console.error(`Story ${file.split(sep).pop()} is either a directory or symlink.`);
            missing++;
        }
    } catch (e) {
        console.error(`Story ${file.split(sep).pop()} does not exist.`);
        missing++;
    }
}

process.exit(missing);
