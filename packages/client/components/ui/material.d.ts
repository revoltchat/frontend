import type { Badge } from "mdui/components/badge";
import type { Checkbox } from "mdui/components/checkbox";
import type { List } from "mdui/components/list";
import type { ListItem } from "mdui/components/list-item";
import type { ListSubheader } from "mdui/components/list-subheader";
import type { NavigationRail } from "mdui/components/navigation-rail";
import type { NavigationRailItem } from "mdui/components/navigation-rail-item";
import type { Tab } from "mdui/components/tab";
import type { TabPanel } from "mdui/components/tab-panel";
import type { Tabs } from "mdui/components/tabs";
import type { TextField } from "mdui/components/text-field";

import type { ComponentProps } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "md-ripple": { disabled?: boolean };

      "mdui-checkbox": ComponentProps<Checkbox>;
      "mdui-tabs": ComponentProps<Tabs>;
      "mdui-tab": ComponentProps<Tab>;
      "mdui-tab-panel": ComponentProps<TabPanel>;
      "mdui-badge": ComponentProps<Badge>;
      "mdui-navigation-rail": ComponentProps<NavigationRail>;
      "mdui-navigation-rail-item": ComponentProps<NavigationRailItem>;
      "mdui-list": ComponentProps<List>;
      "mdui-list-item": ComponentProps<ListItem>;
      "mdui-list-subheader": ComponentProps<ListSubheader>;
      "mdui-text-field": ComponentProps<TextField>;
    }
  }
}
