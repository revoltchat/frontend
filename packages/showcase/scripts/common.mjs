// @ts-check

/**
 * Common module for discovering component files
 */

import { readdir, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

/**
 * Get the path to the root of the monorepo
 * @returns Absolute path
 */
export function getRootDirectory() {
    return resolve(import.meta.url.substring('file://'.length), '..', '..', '..', '..');
}

/**
 * Get the path to the @revolt/ui package
 * @returns Absolute path
 */
 export function getUiPackageDirectory() {
    return resolve(getRootDirectory(), 'components', 'ui');
}

/**
 * Get the path to the components directory in the @revolt/ui package
 * @returns Absolute path
 */
export function getComponentsDirectory() {
    return resolve(getUiPackageDirectory(), 'components');
}

/**
 * Recursively search a directory for files
 * @param {string} path Directory to search from
 * @param {(fn: string) => boolean} filter Whether to include this file in the results
 */
async function recurseSearch(path, filter) {
    const files = await readdir(path);
    const paths = [];

    for (const file of files) {
        const fullPath = resolve(path, file);
        const info = await stat(fullPath);
        if (info.isDirectory()) {
            paths.splice(paths.length, 0, ...await recurseSearch(fullPath, filter));
        } else if (info.isFile()) {
            if (filter(file)) {
                paths.push(fullPath);
            }
        }
    }

    return paths;
}

/**
 * Find all file paths to components
 * @returns List of file paths
 */
export async function findComponents() {
    return recurseSearch(getComponentsDirectory(), fn => fn.endsWith('.tsx'));
}

/**
 * Convert a component file path to a story file path
 * @param {string} path Path to the component file
 * @returns Path to the story file
 */
export function toStoryFile(path) {
    const fn = path.split(sep).pop();
    if (!fn) throw "unreachable";
    return resolve(path, '..', fn.replace(/tsx/, 'stories.tsx'));
}
