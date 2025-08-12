import { JSX, splitProps } from "solid-js";

import { cva } from "styled-system/css";

import { useClient } from "@revolt/client";
import { paramsFromPathname } from "@revolt/routing";
import { Avatar, iconSize } from "@revolt/ui";
import { Invite } from "@revolt/ui/components/features/messaging/elements/Invite";

import MdChat from "@material-design-icons/svg/outlined/chat.svg?component-solid";
import MdChevronRight from "@material-design-icons/svg/outlined/chevron_right.svg?component-solid";
// import { determineLink } from "../../../lib/links";
// import { modalController } from "../../../controllers/modals/ModalController";
import MdTag from "@material-design-icons/svg/outlined/tag.svg?component-solid";

const link = cva({
  base: {
    color: "var(--md-sys-color-primary) !important",
  },
});

const internalLink = cva({
  base: {
    verticalAlign: "bottom",

    gap: "4px",
    paddingLeft: "2px",
    paddingRight: "6px",
    alignItems: "center",
    display: "inline-flex",
    textDecoration: "none !important",

    cursor: "pointer",
    fontWeight: 600,
    borderRadius: "var(--borderRadius-lg)",
    fill: "var(--md-sys-color-on-primary)",
    color: "var(--md-sys-color-on-primary)",
    background: "var(--md-sys-color-primary)",
  },
});

export function RenderAnchor(
  props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  /* eslint-disable solid/reactivity */
  /* eslint-disable solid/components-return-once */

  const [localProps, remoteProps] = splitProps(props, ["href", "target"]);

  // Handle case where there is no link
  if (!localProps.href) return <span>{remoteProps.children}</span>;

  // Handle links that navigate internally
  try {
    let url = new URL(localProps.href);

    // Remap Revolt discover links to native invite links
    if (url.origin === "https://rvlt.gg" && /^\/[\w\d]+$/.test(url.pathname)) {
      url = new URL(`/invite${url.pathname}`, location.origin);
    }

    // Determine whether it's in our scope
    if (
      [
        location.origin,
        "https://app.revolt.chat",
        "https://revolt.chat",
      ].includes(url.origin)
    ) {
      const client = useClient();
      const params = paramsFromPathname(url.pathname);

      if (params.exactChannel) {
        return (
          <a class={internalLink()} href={url.toString()}>
            <MdTag {...iconSize("1em")} />
            {client().channels.get(params.channelId!)?.name}
            {params.exactMessage && (
              <>
                <MdChevronRight {...iconSize("1em")} />
                <MdChat {...iconSize("1em")} />
              </>
            )}
          </a>
        );
      } else if (params.exactServer) {
        const server = () => client().servers.get(params.serverId!);
        return (
          <a class={internalLink()} href={url.toString()}>
            <Avatar size={16} src={server()?.iconURL} /> {server()?.name}
          </a>
        );
      } else if (params.inviteId) {
        return <Invite code={params.inviteId} />;
      } else {
        return <a {...remoteProps} class={link()} href={url.toString()} />;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // failure
  }

  // ... all other links:

  // TODO: link warning
  // Determine type of link

  /*const link = determineLink(localProps.href);
  if (link.type === "none") return <a {...props} />;

  // Render direct link if internal
  if (link.type === "navigate") {
    return <Link to={link.path} children={props.children} />;
  }*/

  return (
    <a
      {...remoteProps}
      class={link()}
      href={localProps.href}
      target={"_blank"}
      rel="noreferrer"
      // onClick={(ev) => modalController.openLink(href) && ev.preventDefault()}
    />
  );
}
