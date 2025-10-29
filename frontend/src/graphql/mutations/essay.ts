import { gql } from '@apollo/client';

export const GENERATE_ESSAY = gql`
  mutation GenerateEssay($input: GenerateEssayInput!) {
    generateEssay(input: $input) {
      title
      content
      comment
    }
  }
`;
