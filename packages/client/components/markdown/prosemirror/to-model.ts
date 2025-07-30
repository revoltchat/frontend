import { schema } from "./schema";

export function markdownToProseMirrorModel(content: string) {
  return schema.nodes.doc.createAndFill(null, [
    schema.nodes.text.createAndFill({
      text: content,
    })!,
  ])!;
}
