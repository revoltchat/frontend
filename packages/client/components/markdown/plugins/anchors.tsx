import { JSX, Show, splitProps } from "solid-js";

import { cva } from "styled-system/css";

import { useClient } from "@revolt/client";
import { useModals } from "@revolt/modal";
import { paramsFromPathname } from "@revolt/routing";
import { useState } from "@revolt/state";
import { Avatar, iconSize } from "@revolt/ui";
import { Invite } from "@revolt/ui/components/features/messaging/elements/Invite";

import MdChat from "@material-design-icons/svg/outlined/chat.svg?component-solid";
import MdChevronRight from "@material-design-icons/svg/outlined/chevron_right.svg?component-solid";
// import { determineLink } from "../../../lib/links";
// import { modalController } from "../../../controllers/modals/ModalController";
import MdTag from "@material-design-icons/svg/outlined/tag.svg?component-solid";

const link = cva({
  base: {
    cursor: "pointer",
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

    // Remap Revolt discover links to native links
    if (url.origin === "https://rvlt.gg") {
      if (/^\/[\w\d]+$/.test(url.pathname)) {
        url = new URL(`/invite${url.pathname}`, location.origin);
      } else if (url.pathname.startsWith("/discover")) {
        url = new URL(url.pathname, location.origin);
      }
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
      } else if (
        params.inviteId &&
        // only display invites if it is just the plain link:
        Array.isArray(remoteProps.children) &&
        remoteProps.children[0] === localProps.href
      ) {
        return <Invite code={params.inviteId} />;
      } else {
        return <a {...remoteProps} class={link()} href={url.toString()} />;
      }
    }

    // ... all other links:
    const state = useState();
    const { openModal } = useModals();

    function onHandleWarning(
      event: MouseEvent & { currentTarget: HTMLAnchorElement },
    ) {
      if (event.button === 0 || event.button === 1) {
        event.preventDefault();

        openModal({
          type: "link_warning",
          url,
          display: event.currentTarget!.innerText,
        });
      }
    }

    return (
      <Show
        when={state.linkSafety.isTrusted(url)}
        fallback={
          <a
            {...remoteProps}
            class={link()}
            onClick={onHandleWarning}
            onAuxClick={onHandleWarning}
          />
        }
      >
        <a
          {...remoteProps}
          class={link()}
          href={localProps.href}
          target={"_blank"}
          rel="noreferrer"
        />
      </Show>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // invalid URL
    return <span>{props.children}</span>;
  }
}
