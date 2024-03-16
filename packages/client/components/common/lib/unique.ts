/**
 * Generation counter
 */
let counter = 0;

/**
 * Generates a guaranteed unique ID for use within the client.
 * This should never be used to uniquely identify something across the network.
 * @returns a unique identifier
 */
export function insecureUniqueId() {
  return Math.random().toString().substring(2) + new Date() + ++counter;
}
