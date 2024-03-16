#! /usr/bin/env node
import chalk from "chalk";

import { main } from "./core.js";

const [_nodeExec, _scriptPath, command, ...args] = process.argv;

async function entryPoint() {
	if (command) {
		switch (command) {
			case "add-contributor":
			case "add-maintainer":
				if (!args[0]) {
					return console.error(
						"[MAIN] You need to specify an issue number."
					);
				}
				await main({
					command: "add",
					maintainer: command === "add-maintainer",
					issue: parseInt(args[0]),
				});
				break;
			case "help":
				const commandList = [
					"add-contributor <issue number> - add a new contributor to the list using the info from the provided GitHub issue",
					"add-maintainer <issue number> - add a new maintainer to the list using the info from the provided GitHub issue",
				];
				console.log(
					`${chalk.bold.underline(
						"Revolt Translations Tools"
					)}\nRequired arguments are wrapped in <angle brackets>; optional arguments are wrapped in [square brackets].\n\n${chalk.bold(
						"Commands"
					)}\n${commandList.join("\n")}`
				);
				break;
			default:
				console.error(
					`Unknown command ${command} - try running translations-scripts help.`
				);
				break;
		}
	} else {
		return console.error(
			"You need to specify a command - try running translations-scripts help."
		);
	}
}

await entryPoint();
