import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GenerateEssayInput {
  @Field({ description: '운동 기록 정보' })
  exercise_record: string;

  @Field({ description: '운동 중 느낀 감정' })
  emotion: string;

  @Field({ description: '사용자 추가 생각이나 이야기' })
  user_additional_thoughts: string;
}
