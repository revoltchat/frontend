import "@material/web/ripple/ripple.js";

interface Props {
  disabled?: boolean;
}

/**
 * Ripple overlay provides hover and pressed states for interactive elements
 *
 * You should ensure the parent element has relative positioning:
 *
 * ```tsx
 * <div class={css({ position: 'relative' })}>
 *   <Ripple />
 *   .. your content
 * </div>
 * ```
 *
 * @library Material Web Components
 * @specification https://m3.material.io/foundations/interaction/states/applying-states
 */
export function Ripple(props: Props) {
  return <md-ripple {...props} />;
}
