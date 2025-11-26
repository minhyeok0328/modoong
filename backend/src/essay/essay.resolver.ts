import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EssayService } from './essay.service';
import { GenerateEssayInput } from './dto/generate-essay.input';
import { EssayResponse } from './types/essay-response.type';

@Resolver()
export class EssayResolver {
  constructor(private readonly essayService: EssayService) {}

  @Mutation(() => EssayResponse, {
    description: '사용자의 운동 경험을 바탕으로 에세이를 생성합니다',
  })
  async generateEssay(
    @Args('input') input: GenerateEssayInput,
  ): Promise<EssayResponse> {
    return this.essayService.generateEssay(input);
  }
}
