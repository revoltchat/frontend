import { schema } from "./schema";

export function blankModel() {
  return schema.nodes.doc.createChecked(
    null,
    schema.nodes.paragraph.createChecked(null),
  );
}

export function markdownToProseMirrorModel(content: string) {
  if (!content) return blankModel();

  return schema.nodes.doc.createChecked(
    null,
    schema.nodes.paragraph.createChecked(null, schema.text(content)),
  );
}
