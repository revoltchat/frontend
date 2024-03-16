import { readFileSync, writeFileSync } from "fs";
import { Octokit } from "octokit";

import { ISO_MAP } from "./consts.js";
import "./env.js";

type Contributor = {
	id: string;
	github: string;
	weblate: string;
};

type Language = {
	maintainer: string[];
	users: Contributor[];
};

type ContributorList = {
	[key: string]: Language;
};

type ParsedIssueObject = {
	languages: string[];
	id: string;
	weblate: string;
};

interface AddCommand {
	command: "add";
	maintainer: boolean;
	issue: number;
}

type Command = AddCommand;

async function readContributors() {
	console.log(`[FS] Fetching existing data...`);
	const buffer = readFileSync("../contributors.json");
	const rawData = buffer.toString("utf8");
	const data = JSON.parse(rawData) as ContributorList;
	console.log(`[FS] Fetched existing data!`);
	return data;
}

async function writeContributors(newDataObject: ContributorList) {
	console.log(`[FS] Saving new data...`);
	const newData = JSON.stringify(newDataObject, null, 4);
	writeFileSync("../contributors.json", newData);
	console.log(`[FS] Saved new data!`);
}

function parseLanguage(language: string) {
	let parsedLanguage;
	for (const l of ISO_MAP) {
		if (language.toLowerCase() === l.name) {
			parsedLanguage = l.code;
		}
	}
	return parsedLanguage ?? "unknown";
}

function parseIssueBody(body: string, maintainer: boolean) {
	let newText = body;

	// make sure new lines are the correct format
	newText = newText.replaceAll(/\r/g, '\n');
	// remove headers
	newText = newText.replace(
		/### What language\(s\) did you translate\?\n*/,
		""
	);
	newText = newText.replace(
		/### What language do you want to maintain\?\n*/,
		""
	);
	newText = newText.replace(/\n*### What is your Revolt ID\?\n*/, " | ");
	newText = newText.replace(/\n*### Revolt ID\n*/, " | ");
	newText = newText.replace(/\n*### Link to Weblate profile\n*/, " | ");

	// remove validations section
	newText = newText.replace(/\n### Validations\n*.*\n*.*/, "");

	// extract Weblate username, then remove trailing slashes/new lines
	newText = newText.replace(/https:\/\/(weblate|translate)\.(insrt|revolt)\.(uk|chat)\/user\//, "");
	newText = newText.replace(/\//, "");
	newText = newText.replaceAll(/\n/g, "");

	// convert it into an array, then parse the languages...
	const array = newText.split(" | ");
	const rawLanguages = array[0].split(", ");
	const languages = [];
	for (const l of rawLanguages) {
		const parsedLanguage = parseLanguage(l);
		if (parsedLanguage === "unknown") {
			console.error(`[PARSER] Unknown language ${l} found in issue body - this could be a typo from the issue author, a non-English name for the language or a missing language in the map`)
		}
		languages.push(parsedLanguage);
	}

	// ...and map everything into an object
	const finalObject = {
		languages: languages,
		id: maintainer ? array[2] : array[1],
		weblate: maintainer? array[1] : array[2],
	} as ParsedIssueObject;
	console.debug(`[PARSER] Parsed object: ${JSON.stringify(finalObject)}`);
	return finalObject;
}

export async function main(command: Command) {
	// read the contributors file
	const data = await readContributors();

	// if the user wants to add a new contributor...
	if (command.command === "add") {
		// ...we log into github...
		const octokit = new Octokit({
			auth: process.env.GITHUB_TOKEN,
			userAgent: "revolt-translations-scripts/v0.1.0",
			timeZone: "Europe/London",
		});

		// ...and fetch the issue data...
		const issueData = await octokit.rest.issues.get({
			owner: "revoltchat",
			repo: "translations",
			issue_number: command.issue,
		});

		// ...then ensure the author exists/has been fetched...
		if (!issueData.data.user || issueData.data.user === null) {
			return console.error("[MAIN] Couldn't fetch issue author, or it was null")
		}

		// ...and check for the issue body...
		if (!issueData.data.body) {
			return console.error(`[MAIN] Couldn't fetch issue body/author`)
		};

		// ...which is then parsed here
		const obj = parseIssueBody(`${issueData.data.body}`, command.maintainer);

		// we then create a contributor object from the parsed info...
		const newContributor = {
			id: obj.id,
			github: issueData.data.user.login,
			weblate: obj.weblate,
		};

		console.debug(`[MAIN] Contributor object: ${JSON.stringify(newContributor)}`);

		// ...and add it to the language's contributor list
		for (const lang of obj.languages) {
			if (data[lang]) {
				var shouldPushObject = true;
				for (const c of data[lang].users) {
					if (c.github === newContributor.github) {
						console.log(command.maintainer ? 
							`[MAIN] User already in ${lang} contributors list; only adding to maintainer list...`
							: `[MAIN] User already in ${lang} contributors list; skipping...`)
						shouldPushObject = false;
					}
				}
				if (command.maintainer) {
					if (!data[lang].maintainer.includes(newContributor.github)) {
					data[lang].maintainer.push(newContributor.github);
					} else {
						console.log(shouldPushObject ? `[MAIN] User already in ${lang} maintainers list; only adding to contributor list...` : `[MAIN] User already in ${lang} maintainers list; skipping...`)
					}
				}
				if (shouldPushObject) {
					data[lang].users.push(newContributor);
				}
			}
		}
	}

	await writeContributors(data);
}

/*
 * WEBLATE INFORMATION
 * WEB URL: POST https://weblate.insrt.uk/access/revolt/add/
 * REQ DATA: "user" = username, plus CSRF token
 */
