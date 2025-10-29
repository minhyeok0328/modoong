import type { Meta, StoryObj } from '@storybook/react';
import SpeechBubble from './index';

const meta: Meta<typeof SpeechBubble> = {
  title: 'Common/SpeechBubble',
  component: SpeechBubble,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpeechBubble>;

export const Default: Story = {
  render: (args) => {
    return (
      <div style={{ padding: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SpeechBubble {...args}>
          모둥이랑 같이 에세이 쓸래요?
        </SpeechBubble>
      </div>
    );
  },
  args: {
    position: 'top',
  },
};

export const Positions: Story = {
  render: () => {
    return (
      <div style={{ padding: 200, display: 'flex', flexDirection: 'column', gap: 100, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 100 }}>
          <div>
            <SpeechBubble position="left">
              Left bubble
            </SpeechBubble>
            <div style={{ padding: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginTop: 10 }}>
              Target
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
            <div>
              <SpeechBubble position="top">
                Top bubble
              </SpeechBubble>
              <div style={{ padding: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginTop: 10 }}>
                Target
              </div>
            </div>
            <div>
              <div style={{ padding: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginBottom: 10 }}>
                Target
              </div>
              <SpeechBubble position="bottom">
                Bottom bubble
              </SpeechBubble>
            </div>
          </div>

          <div>
            <div style={{ padding: 16, backgroundColor: '#e5e7eb', borderRadius: 8, marginRight: 10 }}>
              Target
            </div>
            <SpeechBubble position="right">
              Right bubble
            </SpeechBubble>
          </div>
        </div>
      </div>
    );
  },
  args: {},
};

export const EssayPrompt: Story = {
  render: (args) => {
    return (
      <div style={{ padding: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SpeechBubble {...args}>
          모둥이랑 같이 에세이 쓸래요?
        </SpeechBubble>
        <div style={{
          width: 56,
          height: 56,
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10
        }}>
          ✨
        </div>
      </div>
    );
  },
  args: {
    position: 'left',
  },
};

export const WithCustomClassName: Story = {
  render: (args) => {
    return (
      <div style={{ padding: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SpeechBubble {...args}>
          커스텀 스타일이 적용된 말풍선
        </SpeechBubble>
      </div>
    );
  },
  args: {
    position: 'top',
    className: 'bg-green-500 text-black',
  },
};
