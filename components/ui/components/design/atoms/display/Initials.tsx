export type Props = {
  /**
   * Input string
   */
  input: string;

  /**
   * Maximum length
   */
  maxLength?: number;
};

/**
 * Initials component
 *
 * Takes some string and displays the first letter of each word
 */
export function Initials(props: Props) {
  return (
    <>
      {props.input
        .split(/\s+/)
        .map((x) => x[0])
        .filter((x) => x)
        .slice(0, props.maxLength || 100)}
    </>
  );
}
