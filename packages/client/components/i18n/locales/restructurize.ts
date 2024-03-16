// move stuff
// deno run --allow-read --allow-write restructurize.ts

for await (const entry of Deno.readDir('.')) {
    const fn = entry.name;
    if (fn.endsWith('.json')) {
        if (fn === 'contributors.json') continue;
        console.log('Processing', fn);

        const text = await Deno.readTextFile(fn);
        const data = JSON.parse(text);

        // [2022-04-21] Combine server / channel permissions.
        if (data?.permissions?.server) {
            Object.keys(data.permissions.server)
                .forEach(key => data.permissions[key] = data.permissions.server[key]);
        }

        if (data?.permissions?.channel) {
            Object.keys(data.permissions.channel)
                .forEach(key => data.permissions[key] = data.permissions.channel[key]);
        }

        delete data?.permissions?.server;
        delete data?.permissions?.channel;

        // [2022-04-21] Move ManageRoles to ManageRole
        if (data?.permissions?.ManageRoles) {
            data.permissions.ManageRole = data?.permissions?.ManageRoles;
            delete data?.permissions?.ManageRoles;
        }

        // [2022-04-21] Move View to ViewChannel
        if (data?.permissions?.View) {
            data.permissions.ViewChannel = data?.permissions?.View;
            delete data?.permissions?.View;
        }

        // * Commit
        await Deno.writeTextFile(fn, JSON.stringify(data, undefined, '\t'));
    }
}
