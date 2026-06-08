import type { PortableTextBlock } from "@portabletext/types";
import type { GalleryItem } from "@/types";

/** A gallery item that is a real, displayable image. */
export const isImage = (item: GalleryItem) =>
  item._type === "image" && !!item.url;

/** True only when the rich text actually contains visible characters. */
export const hasRichText = (blocks?: PortableTextBlock[]) =>
  Array.isArray(blocks) &&
  blocks.some((b) =>
    b._type === "block"
      ? ((b.children as Array<{ text?: string }> | undefined) ?? []).some(
          (c) => c.text?.trim(),
        )
      : true,
  );
