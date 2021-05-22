import {
  INSTRUMENT_TEMPLATES,
  INSTRUMENT_TYPES,
} from '../constants/instrument_templates';
import {
  stringCountOptions,
  stringCountOptionsBassDBL,
  stringCountOptionsBassTPL,
  stringCountOptionsGuitarDBL,
} from '../constants/string_count';
import { TUNING_TEMPLATES } from '../constants/tuning_templates';
import { BOILER_STRING_SET } from '../constants/string_sets';
import { InstrumentString } from '../../../generated/instrument_pb';
import { initString } from './string.utils';

export function calculateStringCountOptions(instrumentType: string): number[] {
  switch (instrumentType) {
    case INSTRUMENT_TYPES.GUITAR_DBL: {
      return stringCountOptionsGuitarDBL;
    }
    case INSTRUMENT_TYPES.BASS_DBL: {
      return stringCountOptionsBassDBL;
    }
    case INSTRUMENT_TYPES.BASS_TPL: {
      return stringCountOptionsBassTPL;
    }
    default: {
      return stringCountOptions;
    }
  }
}

export const calculateTuningOptions = (
  instrumentType: string,
  stringCount: number,
) => {
  switch (instrumentType) {
    case INSTRUMENT_TYPES.BASS: {
      return TUNING_TEMPLATES['bass'][stringCount];
    }
    case INSTRUMENT_TYPES.BASS_DBL: {
      return TUNING_TEMPLATES['bass'][stringCount / 2];
    }
    case INSTRUMENT_TYPES.BASS_TPL: {
      return TUNING_TEMPLATES['bass'][stringCount / 3];
    }
    case INSTRUMENT_TYPES.GUITAR_DBL: {
      return TUNING_TEMPLATES['guitar'][stringCount / 2];
    }
    default: {
      return TUNING_TEMPLATES['guitar'][stringCount];
    }
  }
};

export function newStringToSet(
  strings: InstrumentString.AsObject[],
  addHigher: boolean = false,
): InstrumentString.AsObject[] {
  const templateLength = INSTRUMENT_TEMPLATES.guitar.length;
  const exceedsBaseTemplate =
    INSTRUMENT_TEMPLATES.guitar.length - 1 < strings.length + 1;
  const template = addHigher
    ? INSTRUMENT_TEMPLATES.guitar[0]
    : exceedsBaseTemplate
    ? INSTRUMENT_TEMPLATES.guitar[templateLength - 1]
    : INSTRUMENT_TEMPLATES.guitar[strings.length + 1];
  const defaultGauge = addHigher
    ? BOILER_STRING_SET[0]
    : exceedsBaseTemplate
    ? BOILER_STRING_SET[BOILER_STRING_SET.length - 1]
    : BOILER_STRING_SET[strings.length];
  const baseString: InstrumentString.AsObject = initString({
    stringNumber: addHigher ? 1 : strings.length + 1,
    scaleLength: 25.5,
    note: template.note,
    octave: template.octave,
    tensile: 400000,
    brand: defaultGauge > 0.02 ? 'DANW' : 'DAPL',
    gauge: defaultGauge,
    offset: 0,
    tension: 0,
    breakingPoint: 0,
    stress: 0,
    frequency: 0,
    unitWeight: 0,
  });
  return addHigher
    ? [
        baseString,
        ...strings.map((s) => ({ ...s, stringNumber: s.stringNumber + 1 })),
      ]
    : [...strings, baseString];
}
