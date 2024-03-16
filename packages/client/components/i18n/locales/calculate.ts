// deno run --allow-read --allow-write calculate.ts

import contributors from './contributors.json' assert { type: 'json' };

// calculate % translated by looking at key counts
function count(obj: any, acc = 0) {
    if (typeof obj === 'object') {
        for (const key in obj) {
            acc += count(obj[key]);
        }
    }

    return acc + 1;
}

const threshold = count(JSON.parse(await Deno.readTextFile('en.json'))) - 50;
const below_threshold = [];

for await (const entry of Deno.readDir('.')) {
    const fn = entry.name;
    if (fn.endsWith('.json')) {
        if (fn === 'contributors.json') continue;
        console.log('Processing', fn);

        const text = await Deno.readTextFile(fn);
        const data = JSON.parse(text);

        if (count(data) < threshold) {
            below_threshold.push(fn.split('.')[0]);
        }
    }
}

await Deno.writeTextFile("incomplete.js", 'export default ' + JSON.stringify(below_threshold, undefined, '\t'));

// write verified translations to file
await Deno.writeTextFile("verified.js", 'export default ' + JSON.stringify(Object.keys(contributors).filter(x => contributors[x].maintainer.length > 0), undefined, '\t'));

// generate new README
import { Languages } from './Languages.ts';

const u = (s) => `[@${s}](https://github.com/${s})`;

const table = `|   | Language | Maintainers | Contributors |
|:-:|---|---|---|
${Object.keys(Languages)
.map(key => {
    const lang = Languages[key];
    const maintainers = [], contribs = [];
    
    const entry = contributors[key];
    if (entry) {
        for (const user of entry.users) {
            if (entry.maintainer.includes(user.github)) {
                maintainers.push(user.github);
            } else {
                contribs.push(user.github);
            }
        }
    }

    return `|${lang.emoji}|${lang.display} / ${key}|${maintainers.map(u).join(' ')}|${contribs.map(u).join(' ')}|`;
})
.join('\n')}`;

await Deno.writeTextFile("README.md", (await Deno.readTextFile("README.template.md")).replace(/{{TABLE}}/g, table));

/*|     | Language           | Maintainers                                            |
| :-: | ------------------ | ------------------------------------------------------ |
| 🇬🇧  | English (UK)       | [@insertish](https://github.com/insertish/)            |
| 🇩🇪  | German             | [@janderedev](https://github.com/janderedev/)          |
| 🇸🇪  | Swedish            | [@raggebatman](https://github.com/raggebatman)         |
| 🇭🇺  | Hungarian          | [@f3rr31](https://github.com/f3rr31)                   |
|     | Central Kurdish    | [@fanticwastaken](https://github.com/fanticwastaken)   |
| 🇧🇷  | Portugese (Brazil) | [@yanndere](https://github.com/yanndere)               |
| 🇫🇷  | French             | [@Hades785](https://github.com/Hades785)               |
|     | Breton             | [@SperedAnveliour](https://github.com/SperedAnveliour) |
| 🇱🇻  | Latvian            | [@rMazeiks](https://github.com/rMazeiks)               |
| 🇸🇦  | Arabic             | [@LedaThemis](https://github.com/LedaThemis)           |
| 🇷🇺  | Russian            | [@div2005](https://github.com/div2005)                 |
| 🇺🇦  | Ukranian           | [@div2005](https://github.com/div2005)                 |
| 🇪🇪  | Estonian           | [@u032](https://github.com/u032)                       |
| 🇵🇭  | Filipino           | [@I2rys](https://github.com/I2rys)                     |
| 🇮🇷  | Persian            | [@DevEvil99](https://github.com/DevEvil99)             |*/