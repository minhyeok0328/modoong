import type { Meta, StoryObj } from '@storybook/react';
import Card from './index';
import Button from '../button';

const meta: Meta<typeof Card> = {
  title: 'Common/Card',
  component: Card,
};

export default meta;

// ---------------------------------------------------------------------

type Story = StoryObj<typeof Card>;

export const FacilitySuggestion: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <Card.Row>
        <Card.Image placeholder={<span className="text-xs">센터\n사진\n1:1</span>} />
        <Card.Column>
          <Card.Title>광명국민체육센터</Card.Title>
          <Card.Subtitle className="text-xs">경기도 고양시 일산서구 탄현로 139</Card.Subtitle>
          <Card.Subtitle className="text-xs">(시계) 운영시간: 06:00~22:00</Card.Subtitle>
        </Card.Column>
      </Card.Row>

      <Card.Content className="font-semibold mt-6 text-base">
        3월 5일 월요일 08:00 탁구 어때요? {'>'}
      </Card.Content>
    </Card>
  ),
};

export const FriendFoundSingleAction: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <Card.Title className="mb-3">같은 시간대 운동 친구를 찾았어요!</Card.Title>
      <Card.Row>
        <Card.Image size="w-12 h-12" rounded="full" />
        <Card.Column>
          <Card.Subtitle>이영수님 (지체장애, 32세)</Card.Subtitle>
          <Card.Subtitle className="text-xs">(위치) 용인시 기흥구</Card.Subtitle>
          <Card.Subtitle className="text-xs">선호 운동: 수영</Card.Subtitle>
          <Card.Subtitle className="text-xs">매너 온도: 38도</Card.Subtitle>
        </Card.Column>
      </Card.Row>

      <Card.Actions className="justify-center">
        <Button variant="primary">운동 친구 신청</Button>
      </Card.Actions>
    </Card>
  ),
};

export const FriendFoundTwoActions: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <Card.Title className="mb-3">같은 시간대 운동 친구를 찾았어요!</Card.Title>
      <Card.Row>
        <Card.Image size="w-12 h-12" rounded="full" />
        <Card.Column>
          <Card.Subtitle>이영수님 (지체장애, 32세)</Card.Subtitle>
          <Card.Subtitle className="text-xs">(위치) 용인시 기흥구</Card.Subtitle>
          <Card.Subtitle className="text-xs">선호 운동: 수영</Card.Subtitle>
          <Card.Subtitle className="text-xs">매너 온도: 38도</Card.Subtitle>
        </Card.Column>
      </Card.Row>

      <Card.Actions vertical gap="gap-3">
        <Button variant="primary" fullWidth>
          운동 친구 신청
        </Button>
        <Button variant="secondary" fullWidth>
          다른 친구 보기
        </Button>
      </Card.Actions>
    </Card>
  ),
};
