import type { Meta, StoryObj } from '@storybook/react';
import MessageInput from './index';

const meta: Meta<typeof MessageInput> = {
  title: 'Common/MessageInput',
  component: MessageInput,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSendMessage: (message: string) => console.log('Message sent:', message),
    placeholder: '메시지를 입력하세요...',
    disabled: false,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onSendMessage: (message: string) => console.log('Message sent:', message),
    placeholder: '여기에 메시지를 작성해주세요',
    disabled: false,
  },
};

export const CommentInput: Story = {
  args: {
    onSendMessage: (message: string) => console.log('Comment sent:', message),
    placeholder: '댓글을 입력하세요...',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    onSendMessage: (message: string) => console.log('Message sent:', message),
    placeholder: '메시지를 입력할 수 없습니다',
    disabled: true,
  },
};