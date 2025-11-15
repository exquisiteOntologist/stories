import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { PillButton } from ".";
import { IconBookmark } from "../icons/bookmark";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Atoms/Buttons/Pill Button",
  component: PillButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { action: fn() },
} satisfies Meta<typeof PillButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Gray: Story = {
  args: {
    label: "Pill",
    Icon: undefined,
    // action: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    label: "The Pill",
    Icon: IconBookmark,
  },
};

export const WithIconActive: Story = {
  args: {
    label: "The Pill",
    Icon: IconBookmark,
    active: true,
    activeClass: "bg-[#F0315D] text-white",
  },
};
