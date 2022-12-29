import type { API } from "revolt.js";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../stories";
import { Attachment } from "./Attachment";

const attachments: {
  [key in
    | "audio"
    | "text"
    | "file"
    | `${"tall" | "wide"}_${"image" | "video"}`]: API.File;
} = {
  tall_image: {
    tag: "attachments",
    content_type: "image/jpg",
    _id: "jeremy-hynes-4tmtN4YU5yM-unsplash.jpg",
    filename: "jeremy-hynes-4tmtN4YU5yM-unsplash.jpg",
    size: 5_000,
    metadata: {
      type: "Image",
      width: 640,
      height: 960,
    },
  },
  wide_image: {
    tag: "attachments",
    content_type: "image/jpg",
    _id: "maxim-berg-Ac02zYZs22Y-unsplash.jpg",
    filename: "maxim-berg-Ac02zYZs22Y-unsplash.jpg",
    size: 5_000,
    metadata: {
      type: "Image",
      width: 640,
      height: 427,
    },
  },
  tall_video: {
    tag: "attachments",
    content_type: "video/mp4",
    _id: "pexels-polina-kovaleva-8035714.mp4",
    filename: "pexels-polina-kovaleva-8035714.mp4",
    size: 5_000,
    metadata: {
      type: "Video",
      width: 360,
      height: 640,
    },
  },
  wide_video: {
    tag: "attachments",
    content_type: "video/mp4",
    _id: "pexels-lachlan-ross-8775687.mp4",
    filename: "pexels-lachlan-ross-8775687.mp4",
    size: 5_000,
    metadata: {
      type: "Video",
      width: 640,
      height: 360,
    },
  },
  audio: {
    tag: "attachments",
    content_type: "audio/ogg",
    _id: "667237__klankbeeld__pound-in-summer-hydrophone-1331-220725-0457.wav",
    filename:
      "667237__klankbeeld__pound-in-summer-hydrophone-1331-220725-0457.wav",
    size: 5_000,
    metadata: {
      type: "Audio",
    },
  },
  text: {
    tag: "attachments",
    content_type: "plain/text",
    _id: "file.txt",
    filename: "file.txt",
    size: 2_500,
    metadata: {
      type: "Text",
    },
  },
  file: {
    tag: "attachments",
    content_type: "application/octet-stream",
    _id: "file",
    filename: "file",
    size: 2_500,
    metadata: {
      type: "File",
    },
  },
};

export default {
  category: "Messaging/Message/Attachment",
  component: Attachment,
  stories: [
    {
      title: "Image (Tall)",
      props: {
        file: attachments.tall_image,
      },
    },
    {
      title: "Image (Wide)",
      props: {
        file: attachments.wide_image,
      },
    },
    {
      title: "Image (Tall Spoiler)",
      props: {
        file: {
          ...attachments.tall_image,
          filename: "SPOILER_tall.jpg",
        },
      },
    },

    {
      title: "Image (Wide Spoiler)",
      props: {
        file: {
          ...attachments.wide_image,
          filename: "SPOILER_wide.jpg",
        },
      },
    },
    {
      title: "Video (Tall)",
      props: {
        file: attachments.tall_video,
      },
    },
    {
      title: "Video (Wide)",
      props: {
        file: attachments.wide_video,
      },
    },
    {
      title: "Video (Tall Spoiler)",
      props: {
        file: {
          ...attachments.tall_video,
          filename: "SPOILER_tall.mp4",
        },
      },
    },
    {
      title: "Video (Wide Spoiler)",
      props: {
        file: { ...attachments.wide_video, filename: "SPOILER_wide.mp4" },
      },
    },
    {
      title: "Audio",
      props: {
        file: attachments.audio,
      },
    },
    {
      title: "Text",
      props: {
        file: attachments.text,
      },
    },
    {
      title: "Text (Large)",
      props: {
        file: {
          ...attachments.text,
          size: 1_000_000,
        },
      },
    },
    {
      title: "File",
      props: {
        file: attachments.file,
      },
    },
  ],
  props: {
    baseUrl: "http://local.revolt.chat:5273",
  },
  propTypes: {},
} as ComponentStory<typeof Attachment, ComponentProps<typeof Attachment>>;
