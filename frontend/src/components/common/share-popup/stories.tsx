import type { Meta, StoryObj } from '@storybook/react';
import { useState, useRef } from 'react';
import SharePopup from './index';

const meta: Meta<typeof SharePopup> = {
  title: 'Common/SharePopup',
  component: SharePopup,
  argTypes: {
    isOpen: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
    url: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SharePopup>;

const SharePopupDemo = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="p-8">
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          공유하기
        </button>
        <SharePopup
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
        />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: SharePopupDemo,
  args: {
    title: '수원종합운동장 수영장',
    description: '경기도 수원시 기흥구 통일로 1050',
    url: 'https://example.com/facility/1',
  },
};

export const CustomContent: Story = {
  render: SharePopupDemo,
  args: {
    title: '모두필드 - 운동시설 예약 플랫폼',
    description: '장애인을 위한 운동시설 예약 서비스',
    url: 'https://modufield.com',
  },
};

export const WithoutOutsideClick: Story = {
  render: SharePopupDemo,
  args: {
    title: '수원종합운동장 수영장',
    description: '경기도 수원시 기흥구 통일로 1050',
    url: 'https://example.com/facility/1',
    closeOnOutsideClick: false,
  },
};

export const CustomPosition: Story = {
  render: (args: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div className="p-8 flex justify-end">
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            우측 정렬 공유
          </button>
          <SharePopup
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            triggerRef={buttonRef}
            className="right-0"
          />
        </div>
      </div>
    );
  },
  args: {
    title: '수원종합운동장 수영장',
    description: '경기도 수원시 기흥구 통일로 1050',
    url: 'https://example.com/facility/1',
  },
};
