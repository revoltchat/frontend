import { resolve } from 'node:path';
import { symlink, readdir, rmdir, stat } from 'node:fs/promises';

const path = './public/assets';

try {
    const f = await stat(path);
    
    if (f.isSymbolicLink()) {
        process.exit(0);
    }

    if (f.isDirectory()) {
        if (await readdir(path).length) {
            process.exit(0);
        }

        await rmdir(path);
    }

    await symlink(resolve('./assets_fallback'), resolve(path));
} catch (err) {}

