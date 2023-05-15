import { BiSolidBot } from "solid-icons/bi";

import { CategoryButton, Column, Preloader, Typography } from "@revolt/ui";

/**
 * Bots
 */
export default function Bots() {
  return (
    <Column gap="xl">
      <CategoryButton
        action="chevron"
        icon={<BiSolidBot size={24} />}
        onClick={() => void 0}
        description="You agree that your bot is subject to the Acceptable Usage Policy."
      >
        Create Bot
      </CategoryButton>
      <Column>
        <Typography variant="label">My Bots</Typography>
        <Preloader type="ring" />
      </Column>
    </Column>
  );
}
