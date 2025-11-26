import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EssayResponse {
  @Field({ description: '에세이 제목 (최대 30자)' })
  title: string;

  @Field({ description: '에세이 내용 (최대 500자)' })
  content: string;

  @Field({ description: '에세이 댓글 (최대 30자)' })
  comment: string;
}