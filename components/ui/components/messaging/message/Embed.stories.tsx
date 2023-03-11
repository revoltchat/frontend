import type { ComponentProps } from "solid-js";

import type { API } from "revolt.js";

import FitContentDecorator from "../../../decorators/FitContentDecorator";
import ResizeContentDecorator from "../../../decorators/ResizeContainerDecorator";
import MotherboardIcon from "../../../test-images/icons8-motherboard-48.png";
import type { ComponentStory } from "../../stories";

import { attachments } from "./Attachment.stories";
import { Embed } from "./Embed";

const embeds: {
  [key in "text" | "website" | "image" | "video"]: API.Embed;
} = {
  text: {
    type: "Text",
    title: "My Text Embed",
    description: "hello and welcome to my embed",
    icon_url: MotherboardIcon,
    colour: "#ff4655",
    url: "https://revolt.chat",
    media: {
      ...attachments.tall_image,
      _id: "jeremy-hynes-3qe0f3-i-Pc-unsplash.jpg",
      metadata: {
        type: "Image",
        width: 360,
        height: 640,
      },
    },
  },
  website: {
    type: "Website",
    site_name: "Motherboard",
    icon_url: MotherboardIcon,
    title: "This Is The Article Of All Time",
    description: "This embed has a small preview image on the right...",
    original_url: "https://revolt.chat",
    url: "https://revolt.chat/posts/eat-drywall",
    image: {
      url: "http://local.revolt.chat:5273/attachments/maxim-berg-Ac02zYZs22Y-unsplash.jpg",
      width: 640,
      height: 427,
      size: "Preview",
    },
  },
  image: {
    type: "Image",
    url: "http://local.revolt.chat:5273/attachments/jeremy-hynes-3qe0f3-i-Pc-unsplash.jpg",
    width: 640,
    height: 1138,
    size: "Large",
  },
  video: {
    type: "Video",
    url: "http://local.revolt.chat:5273/attachments/pexels-polina-kovaleva-8035714.mp4",
    width: 360,
    height: 640,
  },
};

export default {
  category: "Messaging/Message/Embed",
  component: Embed,
  stories: [
    {
      title: "Text",
      props: {
        embed: embeds.text,
      },
    },
    {
      title: "Website",
      props: {
        embed: embeds.website,
      },
    },
    {
      title: "Website (Large Preview)",
      props: {
        embed: {
          ...embeds.website,
          description: "This embed has a large image preview attached.",
          image: {
            ...(embeds.website as any).image,
            size: "Large",
          },
        },
      },
    },
    {
      title: "Website (With Video)",
      props: {
        embed: {
          ...embeds.website,
          description: "This embed has a video attached.",
          video: {
            url: "http://local.revolt.chat:5273/attachments/pexels-lachlan-ross-8775687.mp4",
            width: 640,
            height: 360,
          },
        },
      },
    },
    {
      title: "Image",
      props: {
        embed: embeds.image,
      },
    },
    {
      title: "Video",
      props: {
        embed: embeds.video,
      },
    },
    {
      title: "GIF (Video)",
      props: {
        embed: {
          ...embeds.website,
          video: {
            url: "http://local.revolt.chat:5273/attachments/pexels-lachlan-ross-8775687.mp4",
            width: 640,
            height: 360,
          },
          special: {
            type: "GIF",
          },
        },
      },
    },
    {
      title: "GIF (Image)",
      props: {
        embed: {
          ...embeds.website,
          special: {
            type: "GIF",
          },
        },
      },
    },
    {
      title: "YouTube",
      props: {
        embed: {
          type: "Website",
          special: {
            type: "YouTube",
            id: "LXb3EKWsInQ",
          },
        },
      },
      skipRegressionTests: true,
    },
    {
      title: "Twitch",
      props: {
        embed: {
          type: "Website",
          special: {
            type: "Twitch",
            content_type: "Channel",
            id: "insertpaulhere",
          },
        },
      },
      skipRegressionTests: true,
    },
    {
      title: "Lightspeed",
      props: {
        embed: {
          type: "Website",
          special: {
            type: "Lightspeed",
            content_type: "Channel",
            id: "insert",
          },
        },
      },
      skipRegressionTests: true,
    },
    {
      title: "Spotify",
      props: {
        embed: {
          type: "Website",
          special: {
            type: "Spotify",
            content_type: "track",
            id: "4NsPgRYUdHu2Q5JRNgXYU5",
          },
        },
      },
      skipRegressionTests: true,
    },
    {
      title: "Soundcloud",
      props: {
        embed: {
          type: "Website",
          url: "https://soundcloud.com/minecraftwizards/18-c418-sweden",
          special: {
            type: "Soundcloud",
          },
        },
      },
      skipRegressionTests: true,
    },
    {
      title: "Bandcamp",
      props: {
        embed: {
          type: "Website",
          special: {
            type: "Bandcamp",
            content_type: "Album",
            id: "1349219244",
          },
        },
      },
      skipRegressionTests: true,
    },
  ],
  props: {
    proxyFile(url) {
      return url;
    },
  },
  propTypes: {},
  decorators: [FitContentDecorator],
} as ComponentStory<typeof Embed, ComponentProps<typeof Embed>>;
