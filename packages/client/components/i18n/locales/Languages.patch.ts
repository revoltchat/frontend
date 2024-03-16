import incomplete from "./incomplete";
import verified from "./verified";
import { Languages } from "./Languages";

// Apply 'incomplete' flag at runtime
for (const key of incomplete) {
    const entry = Languages[key as keyof typeof Languages];
    if (entry) {
        entry.incomplete = true;
    }
}

// Apply 'verified' flag at runtime
for (const key of verified) {
    const entry = Languages[key as keyof typeof Languages];
    if (entry) {
        entry.verified = true;
    }
}
