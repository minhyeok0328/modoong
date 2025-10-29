type TwoDigit<T extends number> = T extends number
  ? `${T extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ? '0' : ''}${T}`
  : never;

type CreateRange<
  Start extends number,
  End extends number,
  Acc extends number[] = [],
> = Acc['length'] extends End
  ? Acc[number]
  : CreateRange<Start, End, [...Acc, Acc['length'] extends Start ? Start : [...Acc, 1]['length']]>;

export type Hour = TwoDigit<CreateRange<0, 23>>;
export type Minute = TwoDigit<CreateRange<0, 59>>;
export type Time = `${Hour}:${Minute}`;

export interface TimeRange {
  start: Time;
  end: Time;
}
