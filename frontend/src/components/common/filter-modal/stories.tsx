import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FilterModal from './index';

const meta: Meta<typeof FilterModal> = {
  title: 'Components/Common/FilterModal',
  component: FilterModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

// 기본 스토리
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [facilityType, setFacilityType] = useState('');
    const [distance, setDistance] = useState('');

    const facilityTypeOptions = [
      { value: 'gym', label: '체육관' },
      { value: 'pool', label: '수영장' },
      { value: 'field', label: '운동장' },
      { value: 'tennis', label: '테니스장' },
      { value: 'basketball', label: '농구장' },
      { value: 'badminton', label: '배드민턴장' },
    ];

    const distanceOptions = [
      { value: '5', label: '5km 이내' },
      { value: '10', label: '10km 이내' },
      { value: '15', label: '15km 이내' },
      { value: '30', label: '30km 이내' },
      { value: 'unlimited', label: '상관없음' },
    ];

    const sections = [
      {
        title: '체육시설 타입',
        subtitle: '원하는 시설 종류를 선택하세요',
        options: facilityTypeOptions,
        value: facilityType,
        onChange: setFacilityType,
      },
      {
        title: '거리',
        subtitle: '최대 거리를 선택하세요',
        options: distanceOptions,
        value: distance,
        onChange: setDistance,
      },
    ];

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium"
        >
          필터 열기
        </button>
        <FilterModal
          title="필터"
          sections={sections}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onApply={() => {
            console.log('적용된 필터:', { facilityType, distance });
            setIsOpen(false);
          }}
          onReset={() => {
            setFacilityType('');
            setDistance('');
          }}
        />
      </div>
    );
  },
};

// 시간 선택 스토리 (사진과 유사한 형태)
export const TimeSelection: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedTime, setSelectedTime] = useState('');

    const timeOptions = [
      { value: '6-8', label: '6~8시' },
      { value: '8-10', label: '8~10시' },
      { value: '10-12', label: '10~12시' },
      { value: '12-14', label: '12~14시' },
      { value: '14-16', label: '14~16시' },
      { value: '16-18', label: '16~18시' },
      { value: '18-20', label: '18~20시' },
      { value: '20-22', label: '20~22시' },
      { value: '22-24', label: '22~24시' },
      { value: '24-26', label: '24~26시' },
      { value: '26-28', label: '26~28시' },
      { value: '28-30', label: '28~30시' },
    ];

    const sections = [
      {
        title: '시간',
        subtitle: '시작시간 기준',
        options: timeOptions,
        value: selectedTime,
        onChange: setSelectedTime,
      },
    ];

    return (
      <FilterModal
        title="시간"
        sections={sections}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={() => {
          console.log('선택된 시간:', selectedTime);
          setIsOpen(false);
        }}
        onReset={() => {
          setSelectedTime('');
        }}
      />
    );
  },
};
