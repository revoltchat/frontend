import { Typography } from "@revolt/ui";
import { MessageQuery } from "../MessageQuery";

export function Home() {
  return <><Typography variant="legacy-settings-title">Admin</Typography><MessageQuery preview query={{ query: 'loli', sort: 'Latest', limit: 200 }} /></>;
}
