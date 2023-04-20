import { resolve } from 'node:path';
import { symlink, readdir, lstat, readlink } from 'node:fs/promises';

const path = resolve('public', 'assets');
const revoltAssets = resolve('assets');
const fallbackAssets = resolve('assets_fallback');

async function createSymlink() {
    try {
        await lstat(revoltAssets);
        if ((await readdir(revoltAssets)).length === 0) throw "Empty Directory";
        await symlink(resolve(revoltAssets), resolve(path));
        console.info(`Configured Revolt assets.`);
    } catch (error) {
        if (error === 'Empty Directory' || error.code === 'ENOENT') {
            await symlink(resolve(fallbackAssets), resolve(path));
            console.info(`Configured fallback assets.`);
        } else {
            console.error(error);
            process.exit(-1);
        }
    }
}

try {
    await lstat(path);
    const link = await readlink(path);
    console.info(`Currently using ${path === revoltAssets ? 'Revolt' : 'fallback'} assets.`);
} catch (error) {
    if (error.code === 'ENOENT') {
        createSymlink();
    } else {
        console.error(error);
        process.exit(-1);
    }
}

