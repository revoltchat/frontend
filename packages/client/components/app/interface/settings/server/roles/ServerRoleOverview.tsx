import { Trans } from "@lingui-solid/solid/macro";
import { Server } from "revolt.js";
import { styled } from "styled-system/jsx";

import { CategoryButton, Column, Draggable, Text } from "@revolt/ui";

import MdDragIndicator from "@material-design-icons/svg/outlined/drag_indicator.svg?component-solid";

import { useSettingsNavigation } from "../../Settings";

/**
 * Menu to see all roles
 */
export function ServerRoleOverview(props: { context: Server }) {
  const { navigate } = useSettingsNavigation();

  return (
    <Column gap="lg">
      <Column gap="sm">
        <CategoryButton
          icon="blank"
          action="chevron"
          description={<Trans>Affects all roles and users</Trans>}
          onClick={() => navigate("roles/default")}
        >
          <Trans>Default Permissions</Trans>
        </CategoryButton>
        <CategoryButton
          icon="blank"
          action="chevron"
          description={<Trans>Create a new role</Trans>}
        >
          <Trans>Create Role</Trans>
        </CategoryButton>
      </Column>

      <Column gap="sm">
        <Text class="label">
          Note: the drag and drop doesn't do anything yet
        </Text>
        <Draggable items={props.context.orderedRoles} onChange={() => void 0}>
          {(role) => (
            <ItemContainer>
              <MdDragIndicator />

              <CategoryButton
                icon={
                  <RoleIcon
                    style={{
                      background: role.colour ?? "var(--colours-foreground)",
                    }}
                  />
                }
                action="chevron"
                onClick={() => navigate(`roles/${role.id}`)}
              >
                {role.name}
              </CategoryButton>
            </ItemContainer>
          )}
        </Draggable>
      </Column>
    </Column>
  );
}

const RoleIcon = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    aspectRatio: "1/1",
    borderRadius: "100%",
  },
});

const ItemContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-md)",
    paddingBottom: "var(--gap-md)",

    // grow the button to full width
    "& > :nth-child(2)": {
      flexGrow: 1,
    },
  },
});
