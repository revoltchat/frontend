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
export function Initials({ input, maxLength }: Props) {
  return (
    <>
      {input
        .split(/\s+/)
        .map((x) => x[0])
        .filter((x) => x)
        .slice(0, maxLength || 100)}
    </>
  );
}
