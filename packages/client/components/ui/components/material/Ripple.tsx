import "@material/web/ripple/ripple.js";

/**
 * Place in any container that is positioned 'relative' to add ripple
 */
export function Ripple(props: { disabled?: boolean }) {
  return <md-ripple {...props} />;
}
