import Home from '@/pages/Home';
import Login from '@/pages/Login';
import AllMenu from '@/pages/AllMenu';
import MyPage from '@/pages/MyPage';
import Matching from '@/pages/Matching';
import {
  RegisterLayout,
  ReservationCompleteLayout,
  ReservationLayout,
  LoungeLayout,
  FriendFinderLayout,
  MateFinderLayout,
  ChatLayout,
  Default,
  LoungePostLayout,
  MyPageLayout,
  SimpleLayout,
} from '@/layouts';
import {
  Intro,
  PrivacyAgreement,
  ActivityRegion,
  ActivityPreference,
  ActivitySchedule,
  RegisterComplete,
  SportPreference,
} from '@/pages/register';
import {
  Search,
  FacilityList,
  FacilityDetail,
  ReservationComplete,
  ReviewWrite,
  FriendFinder,
  ReservationHistory,
} from '@/pages/reservation';
import { LoungeMain, PostDetail, WritePost, AIEssayWrite, AIEssayResult, AIEssayComplete } from '@/pages/lounge';
import {
  FinderStep1,
  FinderStep2,
  FinderStep3,
  FinderStep4,
  FinderStep5,
  FinderStep6,
} from '@/pages/mate';
import ChatList from '@/pages/chat/ChatList';
import ChatRoom from '@/pages/chat/ChatRoom';

export const routes = [
  {
    element: <Default />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/all-menu', element: <AllMenu /> },
    ],
  },
  {
    element: <MyPageLayout />,
    path: '/mypage',
    children: [
      { path: '', element: <MyPage /> },
    ],
  },
  {
    element: <ChatLayout />,
    path: '/chat',
    children: [
      { path: '', element: <ChatList /> },
      { path: ':roomId', element: <ChatRoom /> },
    ],
  },
  {
    element: <LoungeLayout />,
    path: '/lounge',
    children: [
      { path: '', element: <LoungeMain /> },
      { path: ':postId', element: <PostDetail /> },
    ],
  },
  {
    element: <LoungePostLayout />,
    path: '/lounge',
    children: [
      { path: 'write', element: <WritePost /> },
      { path: 'ai-essay', element: <AIEssayWrite /> },
      { path: 'ai-essay/result', element: <AIEssayResult /> },
      { path: 'ai-essay/complete', element: <AIEssayComplete /> },
    ],
  },
  {
    element: <ReservationLayout />,
    path: '/reservation',
    children: [
      { path: '', element: <Search /> },
      { path: 'facility-list', element: <FacilityList /> },
      { path: 'facility/:id', element: <FacilityDetail /> },
      { path: 'history', element: <ReservationHistory /> },
    ],
  },
  {
    element: <ReservationCompleteLayout />,
    path: '/reservation/reservation-complete',
    children: [{ path: '', element: <ReservationComplete /> }],
  },
  {
    element: <ReservationCompleteLayout />,
    path: '/reservation/review-write',
    children: [{ path: '', element: <ReviewWrite /> }],
  },
  {
    element: <RegisterLayout />,
    path: '/register',
    children: [
      {
        path: '',
        element: <Intro />,
      },
      {
        path: 'privacy-agreement',
        element: <PrivacyAgreement />,
      },
      {
        path: 'activity-region',
        element: <ActivityRegion />,
      },
      {
        path: 'activity-preference',
        element: <ActivityPreference />,
      },
      {
        path: 'sport-preference',
        element: <SportPreference />,
      },
      {
        path: 'activity-schedule',
        element: <ActivitySchedule />,
      },
      {
        path: 'register-complete',
        element: <RegisterComplete />,
      },
    ],
  },
  {
    element: <FriendFinderLayout />,
    path: '/mate/friend-finder',
    children: [{ path: '', element: <FriendFinder /> }],
  },
  {
    element: <SimpleLayout />,
    path: '/mate',
    children: [{ path: '', element: <Matching /> }],
  },
  {
    element: <MateFinderLayout />,
    path: '/mate',
    children: [
      { path: 'finder/step1', element: <FinderStep1 /> },
      { path: 'finder/step2', element: <FinderStep2 /> },
      { path: 'finder/step3', element: <FinderStep3 /> },
      { path: 'finder/step4', element: <FinderStep4 /> },
      { path: 'finder/step5', element: <FinderStep5 /> },
      { path: 'finder/step6', element: <FinderStep6 /> },
    ],
  },
];
