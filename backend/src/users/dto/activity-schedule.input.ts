import { InputType, Field } from '@nestjs/graphql';

@InputType()
class TimeSlotInput {
  @Field()
  start: string;

  @Field()
  end: string;

  @Field()
  selected: boolean;
}

@InputType()
export class ActivityScheduleInput {
  @Field(() => TimeSlotInput)
  dawn: TimeSlotInput;

  @Field(() => TimeSlotInput)
  morning: TimeSlotInput;

  @Field(() => TimeSlotInput)
  noon: TimeSlotInput;

  @Field(() => TimeSlotInput)
  afternoon: TimeSlotInput;

  @Field(() => TimeSlotInput)
  evening: TimeSlotInput;

  @Field(() => TimeSlotInput)
  lateNight: TimeSlotInput;
}
