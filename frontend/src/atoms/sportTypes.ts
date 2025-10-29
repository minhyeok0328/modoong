import { useAtom } from 'jotai';
import { GET_SPORT_TYPES, GetSportTypesData } from '@/graphql/queries/sportTypes';
import { atomsWithQuery } from 'jotai-apollo';

const [sportTypesDataAtom] = atomsWithQuery(() => ({
  query: GET_SPORT_TYPES,
}));

export const useSportTypes = () => {
  const [data] = useAtom(sportTypesDataAtom);
  return (data as GetSportTypesData)?.sportTypes || [];
};
