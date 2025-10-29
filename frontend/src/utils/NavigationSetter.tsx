import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from './navigation';
import { useQuery } from '@apollo/client';
import { GET_TOKEN_PAYLOAD, GetTokenPayloadData } from '../graphql/queries';
import { useAtom } from 'jotai';
import { userAtom, appInitializationAtom } from '../atoms/user';

export default function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
}

export function TokenLoader() {
  const [, setUser] = useAtom(userAtom);
  const [, setAppInitialization] = useAtom(appInitializationAtom);

  useQuery<GetTokenPayloadData>(GET_TOKEN_PAYLOAD, {
    onCompleted: (payloadData) => {
      if (payloadData?.tokenPayload) {
        setUser(payloadData.tokenPayload);
      }
      setAppInitialization({
        isInitializing: false,
        isInitialized: true,
      });
    },
    onError: () => {
      setAppInitialization({
        isInitializing: false,
        isInitialized: true,
      });
    },
  });

  return null;
}
