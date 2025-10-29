import { Meta, StoryObj } from '@storybook/react';
import { BoardHeader } from '.';

const meta: Meta<typeof BoardHeader> = {
  component: BoardHeader,
  title: 'lounge/BoardHeader',
};

export default meta;

type Story = StoryObj<typeof BoardHeader>;

export const Default: Story = {
  args: {
    title: 'Sample Title',
    description: 'Sample description',
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Sample Title',
    description: 'Sample description',
    children: <button className="bg-blue-500 text-white px-4 py-2 rounded">Sample Button</button>,
  },
};
