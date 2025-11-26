import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AccessibilityStatusInput {
  @Field()
  hasArmDiscomfort: boolean;

  @Field()
  hasLegDiscomfort: boolean;

  @Field()
  requiresWheelchair: boolean;

  @Field()
  hasHearingDifficulty: boolean;

  @Field()
  hasSpeakingDifficulty: boolean;

  @Field()
  hasOtherImpairments: boolean;

  @Field({ nullable: true })
  otherImpairmentDescription?: string;
}
