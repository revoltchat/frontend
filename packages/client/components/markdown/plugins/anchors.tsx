import { JSX, splitProps } from "solid-js";

import { cva } from "styled-system/css";

// import { determineLink } from "../../../lib/links";

// import { modalController } from "../../../controllers/modals/ModalController";

const link = cva({
  base: {
    color: "blue",
  },
});

export function RenderAnchor(
  props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const [localProps, remoteProps] = splitProps(props, ["href"]);

  // Pass-through no href or if anchor
  if (!localProps.href || localProps.href.startsWith("#"))
    return <a href={localProps.href} {...props} />;

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
      target="_blank"
      rel="noreferrer"
      // onClick={(ev) => modalController.openLink(href) && ev.preventDefault()}
    />
  );
}
