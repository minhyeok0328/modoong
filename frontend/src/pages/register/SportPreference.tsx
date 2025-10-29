import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { AutoCompleteInput } from '@/components/common';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_SPORTS_FACILITY_TYPES,
  GetSportsFacilityTypesData,
} from '@/graphql/queries/sportsFacilityTypes';


export default function SportPreference() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [firstSport, setFirstSport] = useState('');
  const [secondSport, setSecondSport] = useState('');
  const [thirdSport, setThirdSport] = useState('');

  const { data: sportsFacilityTypes } =
    useQuery<GetSportsFacilityTypesData>(GET_SPORTS_FACILITY_TYPES);

  const sportsList = [...(sportsFacilityTypes?.sportsFacilityTypes || [])];

  const handleSportPreferenceUpdate = () => {
    const sportPreferences = [firstSport, secondSport, thirdSport].filter(sport => sport.trim() !== '');
    setRegisterForm({
      ...registerForm,
      sportPreference: sportPreferences,
    });
  };

  useEffect(() => {
    handleSportPreferenceUpdate();
  }, [firstSport, secondSport, thirdSport]);

  useEffect(() => {
    headingRef.current?.focus();
    setIsNextButtonEnabled(true);
  }, []);

  return (
    <div>
      <PageTitle
        ref={headingRef}
        text={
          <>
            거의 다{'\n'}
            왔습니다:){'\n'}
            {'\n'}
            <strong>{registerForm.name}님</strong>은{'\n'}
            <b>어떤 운동</b>을 좋아하세요?
          </>
        }
        aria-label={`거의 다 왔습니다:) ${registerForm.name}님은 어떤 운동을 좋아하세요?`}
        className="mb-8"
      />
      <div className="flex flex-col gap-6">
        <AutoCompleteInput
          value={firstSport}
          onChange={setFirstSport}
          label="좋아하는 운동 1순위"
          placeholder="운동을 입력해주세요"
          suggestions={sportsList}
          id="first-sport"
        />
        <AutoCompleteInput
          value={secondSport}
          onChange={setSecondSport}
          label="좋아하는 운동 2순위"
          placeholder="운동을 입력해주세요"
          suggestions={sportsList}
          id="second-sport"
        />
        <AutoCompleteInput
          value={thirdSport}
          onChange={setThirdSport}
          label="좋아하는 운동 3순위"
          placeholder="운동을 입력해주세요"
          suggestions={sportsList}
          id="third-sport"
        />
      </div>
    </div>
  );
}
