export enum TUNING_TYPES {
  STANDARD = 'STD',
  DROP = 'DRP',
  DADGAD = 'DAD',
  DOUBLE_DROP = 'DDRP',
  DOUBLE_DROP_MM = 'DDRPMM',
  DROP_P4 = 'DRPP4',
  DROP_DADGAD = 'DRPDAD',
  OPEN = 'OPEN',
}

export interface TuningType {
  name: string;
  value: TUNING_TYPES;
}

export const tuningTypeOptions: TuningType[] = [
  {
    name: 'Standard',
    value: TUNING_TYPES.STANDARD,
  },
  {
    name: 'Drop',
    value: TUNING_TYPES.DROP,
  },
  {
    name: 'DADGAD',
    value: TUNING_TYPES.DADGAD,
  },
  {
    name: 'Double Drop Extended (DADADGBE ect)',
    value: TUNING_TYPES.DOUBLE_DROP,
  },
  {
    name: 'Double Drop Mike Mushok (GDADGBE ect)',
    value: TUNING_TYPES.DOUBLE_DROP_MM,
  },
  {
    name: 'Drop + P4 (EAEADGBE ect)',
    value: TUNING_TYPES.DROP_P4,
  },
  {
    name: 'Drop + DADGAD (GDADGAD ect)',
    value: TUNING_TYPES.DROP_DADGAD,
  },
  {
    name: 'OPEN (DADADF#)',
    value: TUNING_TYPES.OPEN,
  },
];
