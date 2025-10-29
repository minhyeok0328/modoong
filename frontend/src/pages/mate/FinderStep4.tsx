import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

export default function FinderStep4() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleNext = () => {
    navigate('/mate/finder/step5');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 200) {
      return;
    }

    setMessage(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <PageTitle
          className="w-full mb-8"
          text={
            <>
              <b>{user?.username}</b>님! 모둥메이트에게<br />전달할 내용을 적어주세요!
            </>
          }
        />

        <p className="text-sm text-gray-600 mb-8">
          *구체적인 활동내용이나 배려해줬으면 하는 부분,<br />
          혹은 당부하고 싶은 말씀이 있다면 자유롭게 적어주세요
        </p>

        <div className="relative">
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder=""
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute bottom-4 right-4 text-sm text-gray-400">
            {message.length}/200
          </div>
        </div>
      </div>

      <div className="pb-6">
        <Button
          fullWidth
          size="lg"
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
