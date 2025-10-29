import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@apollo/client';
import { currentStoryAtom } from '@/atoms/lounge';
import { userAtom } from '@/atoms/user';
import { Button, SimpleHeader } from '@/components/common';
import { GENERATE_ESSAY } from '@/graphql/mutations';

export default function AIEssayWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setCurrentStory = useSetAtom(currentStoryAtom);
  const user = useAtomValue(userAtom);
  const [exerciseRecord, setExerciseRecord] = useState('');
  const [emotion, setEmotion] = useState('');
  const [story, setStory] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const [generateEssay] = useMutation(GENERATE_ESSAY);

  useEffect(() => {
    // 쿼리 파라미터에서 이전 값들 복원
    const exerciseRecordParam = searchParams.get('exerciseRecord');
    const emotionParam = searchParams.get('emotion');
    const storyParam = searchParams.get('story');

    if (exerciseRecordParam) setExerciseRecord(exerciseRecordParam);
    if (emotionParam) setEmotion(emotionParam);
    if (storyParam) setStory(storyParam);
  }, [searchParams]);

  const canSubmit = exerciseRecord.trim() && emotion.trim() && story.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // 임시 저장
    setCurrentStory({
      title: '운동 에세이',
      content: `운동 기록: ${exerciseRecord}\n감정: ${emotion}\n이야기: ${story}`
    });

    setShowLoading(true);

    try {
      const { data } = await generateEssay({
        variables: {
          input: {
            exercise_record: exerciseRecord,
            emotion: emotion,
            user_additional_thoughts: story
          }
        }
      });

      if (data?.generateEssay) {
        // currentStoryAtom에 AI 생성 결과 저장
        setCurrentStory({
          title: '운동 에세이',
          content: `운동 기록: ${exerciseRecord}\n감정: ${emotion}\n이야기: ${story}`,
          aiGeneratedTitle: data.generateEssay.title,
          aiGeneratedContent: data.generateEssay.content,
          aiGeneratedComment: data.generateEssay.comment,
          originalInput: {
            exerciseRecord,
            emotion,
            story
          }
        });

        navigate('/lounge/ai-essay/result');
      }
    } catch (error) {
      console.error('AI 에세이 생성 오류:', error);
      // 에러 발생 시 기본값으로 처리하거나 에러 메시지 표시
    } finally {
      setShowLoading(false);
    }
  };

  const handleClickExerciseRecord = () => {
    const DEFAULT_TEXT = ['걸음수: 23,487걸음', '운동시간: 2시간 52분', '칼로리: 1,030kcal', '거리: 17.4km', '운동종목: 러닝', '운동횟수: 3회'];
    setExerciseRecord(DEFAULT_TEXT.join('\n'));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <SimpleHeader
        title="AI 에세이 쓰기"
        onBackClick={() => navigate(-1)}
      />


      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 운동 기록 입력 */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">나의 운동 기록을 입력해주세요</h2>
          <textarea
            value={exerciseRecord}
            onChange={(e) => setExerciseRecord(e.target.value)}
            placeholder="오늘 어떤 운동을 하셨나요?"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 resize-none"
          />
          <Button size="sm" onClick={handleClickExerciseRecord}>
            운동기록 불러오기
          </Button>
        </div>

        {/* 감정 입력 */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">{user?.username}님의 솔직한 감정을 알려주세요</h2>
          <textarea
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            placeholder="요즘 어떤 기분이셨어요?"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 resize-none"
          />
        </div>
        {/* 이야기 입력 */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">더 하고 싶은 이야기를 적어주세요</h2>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="자유롭게 나의 이야기를 말해보아요"
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-white">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            canSubmit
              ? 'bg-yellow-400 text-black hover:bg-yellow-500'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          모둥이랑 같이 쓰기
        </button>
      </div>
      {/* Loading Popup */}
      {showLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-8 mx-4 transform transition-all duration-500"
            style={{
              animation: 'var(--animate-slide-up)'
            }}
          >
            <div className="text-center">
              <div className="text-xl font-medium text-gray-900 leading-relaxed">
                모둥이가 열심히 에세이 작성을<br />
                도와주고 있어요!
              </div>
              <div className="mt-4">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
