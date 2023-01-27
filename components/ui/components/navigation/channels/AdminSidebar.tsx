import { Typography } from "../../design/atoms/display/Typography";
import { Column } from "../../design/layout";
import { SidebarBase } from "./common";
import { ScrollContainer } from "../../common/ScrollContainers";
import { MenuButton } from "../../design";

/**
 * Display home navigation and conversations
 */
export const AdminSidebar = () => {
  return (
    <SidebarBase>
      <ScrollContainer>
        <Column>
          <p>
            <Typography variant="legacy-settings-title">Admin Panel</Typography>
          </p>
          <MenuButton>Inspector</MenuButton>
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};
