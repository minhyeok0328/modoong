import type { Meta, StoryObj } from '@storybook/react';
import ProfileCard from './index';
import { getRandomFacilityImage } from '@/utils/facilityImages';

const meta: Meta<typeof ProfileCard> = {
  title: 'Common/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as const;

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <ProfileCard>
        <ProfileCard.Image src={getRandomFacilityImage()} alt="사용자 프로필" />
        <ProfileCard.Overlay />
        <ProfileCard.Info
          name="김운동"
          age="20대"
          disability="지체(휠체어)"
          distance="1.5km"
          sport="탁구"
          mbti="ENFP"
        />
        <ProfileCard.Actions>
          <ProfileCard.PrevButton onClick={() => console.log('Previous')} />
          <ProfileCard.CloseButton onClick={() => console.log('Close')} />
          <ProfileCard.MessageButton onClick={() => console.log('Message')} />
          <ProfileCard.HeartButton onClick={() => console.log('Heart')} />
          <ProfileCard.NextButton onClick={() => console.log('Next')} />
        </ProfileCard.Actions>
      </ProfileCard>
    </div>
  ),
};

export const WithoutImage: Story = {
  render: () => (
    <div className="w-80">
      <ProfileCard>
        <ProfileCard.Image />
        <ProfileCard.Overlay />
        <ProfileCard.Info name="김운동" age="20대" disability="지체(휠체어)" distance="1.5km" />
        <ProfileCard.Actions>
          <ProfileCard.CloseButton onClick={() => console.log('Close')} />
          <ProfileCard.MessageButton onClick={() => console.log('Message')} />
          <ProfileCard.HeartButton onClick={() => console.log('Heart')} />
        </ProfileCard.Actions>
      </ProfileCard>
    </div>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <div className="w-80">
      <ProfileCard>
        <ProfileCard.Image src={getRandomFacilityImage()} alt="사용자 프로필" />
        <ProfileCard.Overlay variant="solid" />
        <ProfileCard.Info
          name="김운동"
          age="20대"
          disability="지체(휠체어)"
          distance="1.5km"
          position="center"
        />
        <ProfileCard.Actions layout="vertical" gap="gap-2">
          <ProfileCard.HeartButton onClick={() => console.log('Heart')} />
          <ProfileCard.MessageButton onClick={() => console.log('Message')} />
          <ProfileCard.CloseButton onClick={() => console.log('Close')} />
        </ProfileCard.Actions>
      </ProfileCard>
    </div>
  ),
};

export const DisabledButtons: Story = {
  render: () => (
    <div className="w-80">
      <ProfileCard>
        <ProfileCard.Image src={getRandomFacilityImage()} alt="사용자 프로필" />
        <ProfileCard.Overlay />
        <ProfileCard.Info name="김운동" age="20대" disability="지체(휠체어)" distance="1.5km" />
        <ProfileCard.Actions>
          <ProfileCard.PrevButton disabled onClick={() => console.log('Previous')} />
          <ProfileCard.CloseButton onClick={() => console.log('Close')} />
          <ProfileCard.MessageButton onClick={() => console.log('Message')} />
          <ProfileCard.HeartButton onClick={() => console.log('Heart')} />
          <ProfileCard.NextButton disabled onClick={() => console.log('Next')} />
        </ProfileCard.Actions>
      </ProfileCard>
    </div>
  ),
};
