import { Server } from "revolt.js";

import { Column } from "@revolt/ui";

import { ChannelPermissionsEditor } from "../../channel/permissions/ChannelPermissionsEditor";

/**
 * Role editor
 */
export function ServerRoleEditor(props: { context: Server; roleId: string }) {
  return (
    <Column>
      <ChannelPermissionsEditor
        type="server_role"
        context={props.context}
        roleId={props.roleId}
      />
    </Column>
  );
}
