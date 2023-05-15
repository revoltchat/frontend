import { useClient } from "@revolt/client";
import { Avatar, Column, Row, Typography } from "@revolt/ui";

/**
 * Account Page
 */
export default function () {
  const client = useClient();
  return (
    <Column>
      <Row align>
        <Avatar src={client().user?.animatedAvatarURL} size={64} />
        <Column gap="sm">
          <Typography variant="username">{client().user?.username}</Typography>
          <span>{client().user?.id}</span>
        </Column>
      </Row>
    </Column>
  );
}
