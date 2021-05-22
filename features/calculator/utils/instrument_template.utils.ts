import {
  InstrumentString,
  InstrumentTemplate,
} from '../../../generated/instrument_pb';
import {
  INSTRUMENT_TEMPLATES,
  INSTRUMENT_TYPES,
  NoteTemplate,
} from '../constants/instrument_templates';
import { BOILER_STRING_SET } from '../constants/string_sets';
import { initString } from './string.utils';
import { NOTE_OFFSET } from '../constants/note_offset';
import { TUNING_TYPES } from '../constants/tuning';
import { of } from 'rxjs';

function setNote(
  s: InstrumentString.AsObject,
  offSet: number,
): InstrumentString.AsObject {
  const updatedString = { ...s };

  // Sets the index to be aligned with C as the octave
  const offsetArray = Object.keys(NOTE_OFFSET).reverse();
  const curNoteOffset = offsetArray.indexOf(s.note);
  let offsetIndex = (curNoteOffset + offSet) % 12;
  if (offsetIndex < 0) {
    offsetIndex += 12;
  }
  const offsetOctave = Math.floor((curNoteOffset + offSet) / 12);
  updatedString.note = offsetArray[offsetIndex];
  updatedString.octave -= offsetOctave;
  return updatedString;
}

interface TuneTemplateParams {
  strings: InstrumentString.AsObject[];
  tuningOffset: number;
  stringCount: number;
  instrumentType: string;
}

interface ShiftTuneParams {
  strings: InstrumentString.AsObject[];
  isUp: boolean;
}

export function shiftTuneInstrument(
  params: ShiftTuneParams,
): InstrumentString.AsObject[] {
  return params.strings.map((s) => setNote(s, params.isUp ? -1 : 1));
}

function tuneStringsFromTemplateDRPDADGAD(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  const droppedParams: TuneTemplateParams = {
    strings: strings.slice(0, strings.length - 1),
    stringCount: stringCount - 1,
    tuningOffset: tuningOffset - 2,
    instrumentType,
  };
  const droppedStrings = tuneStringsFromTemplateDADGAD(droppedParams);
  droppedStrings.forEach((s) => newSet.push(s));
  newSet.push(setNote(strings[strings.length - 1], tuningOffset));
  return newSet;
}

function tuneStringsFromTemplateDDRP(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, instrumentType, tuningOffset } = params;
  const newSet: InstrumentString.AsObject[] = [];
  let offSet = tuningOffset - 4;
  strings.forEach((string, index) => {
    // Lowest String
    if (index === stringCount - 1) {
      newSet.push(setNote(string, tuningOffset));
    }
    // 2nd && 3rd Lowest Lowest
    else if (index === stringCount - 2 || index === stringCount - 3) {
      newSet.push(setNote(string, tuningOffset - 2));
    }
    // M3 String (2nd String or 3rd depending on tuning)
    else if (index === 2) {
      // Preserve the M3 Interval when tuning above standard 4ths (E, B, F#, C# Standard ect) on Extended Rang
      if (tuningOffset < 7 && stringCount > 6) {
        newSet.push(setNote(string, offSet));
      } else {
        newSet.push(setNote(string, offSet - 1));
      }
    } else {
      newSet.push(setNote(string, offSet));
    }
  });
  return newSet;
}

function tuneStringsFromTemplateDRP4(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  const droppedParams: TuneTemplateParams = {
    strings: strings.slice(0, strings.length - 1),
    stringCount: stringCount - 1,
    tuningOffset: tuningOffset,
    instrumentType,
  };
  const droppedStrings = tuneStringsFromTemplateDRP(droppedParams);
  droppedStrings.forEach((s) => newSet.push(s));
  newSet.push(setNote(strings[strings.length - 1], tuningOffset));
  return newSet;
}

function tuneStringsFromTemplateDDRPMM(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  const droppedTuneParams: TuneTemplateParams = {
    strings: strings.slice(0, strings.length - 1),
    stringCount: stringCount - 1,
    tuningOffset: tuningOffset - 2,
    instrumentType,
  };
  const droppedStrings = tuneStringsFromTemplateDRP(droppedTuneParams);
  droppedStrings.forEach((s) => newSet.push(s));
  newSet.push(setNote(strings[strings.length - 1], tuningOffset));
  return newSet;
}

function tuneStringsFromTemplateDADGAD(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  let droppedStrings: InstrumentString.AsObject[] = [];
  switch (instrumentType) {
    case INSTRUMENT_TYPES.GUITAR_DBL: {
      droppedStrings =
        stringCount >= 16 && tuningOffset >= 5
          ? tuneStringsFromTemplateDDRP(params)
          : stringCount <= 16
          ? tuneStringsFromTemplateDRP(params)
          : tuneStringsFromTemplateDDRP(params);
      break;
    }
    case INSTRUMENT_TYPES.BASS_DBL: {
      droppedStrings =
        stringCount >= 14 && tuningOffset >= 5
          ? tuneStringsFromTemplateDDRP(params)
          : stringCount <= 14
          ? tuneStringsFromTemplateDRP(params)
          : tuneStringsFromTemplateDDRP(params);
      break;
    }
    case INSTRUMENT_TYPES.BASS_TPL: {
      droppedStrings =
        stringCount >= 21 && tuningOffset >= 5
          ? tuneStringsFromTemplateDDRP(params)
          : stringCount <= 21
          ? tuneStringsFromTemplateDRP(params)
          : tuneStringsFromTemplateDDRP(params);
      break;
    }
    default: {
      droppedStrings =
        stringCount >= 8 && tuningOffset >= 5
          ? tuneStringsFromTemplateDDRP(params)
          : stringCount <= 8
          ? tuneStringsFromTemplateDRP(params)
          : tuneStringsFromTemplateDDRP(params);
    }
  }
  droppedStrings.forEach((string, index) => {
    if (
      (index === 0 || index === 1) &&
      instrumentType === INSTRUMENT_TYPES.BASS
    ) {
      newSet.push(setNote(string, 3));
    } else if (index === 0 || index === 1) {
      newSet.push(setNote(string, 2));
    } else if (
      (index === 2 || index === 3) &&
      instrumentType === INSTRUMENT_TYPES.GUITAR_DBL
    ) {
      newSet.push(setNote(string, 2));
    } else if (index === 2 && stringCount >= 8) {
      newSet.push(setNote(string, tuningOffset < 7 ? 2 : 0));
    } else if (index === 2 && stringCount === 7) {
      newSet.push(setNote(string, tuningOffset < 7 ? 2 : 3));
    } else {
      newSet.push(string);
    }
  });
  return newSet;
}

function tuneStringsFromTemplateDRP(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  const offSet = tuningOffset - 2;
  strings.forEach((string, index) => {
    // Double Course
    if (
      index === stringCount - 2 &&
      (instrumentType === INSTRUMENT_TYPES.GUITAR_DBL ||
        instrumentType === INSTRUMENT_TYPES.BASS_DBL)
    ) {
      newSet.push(setNote(string, tuningOffset));
    }
    // Triple Course
    else if (
      (index === stringCount - 1 ||
        index === stringCount - 2 ||
        index === stringCount - 3) &&
      instrumentType === INSTRUMENT_TYPES.BASS_TPL
    ) {
      newSet.push(setNote(string, tuningOffset));
    }
    // Double Course M3 String (2nd String or 3rd depending on tuning)
    else if (
      (index === 4 || index === 5) &&
      instrumentType === INSTRUMENT_TYPES.GUITAR_DBL
    ) {
      // Preserve the M3 Interval when tuning above standard 4ths (E, B, F#, C# Standard ect) on Extended Range
      if (tuningOffset < 7 && stringCount > 12) {
        newSet.push(setNote(string, offSet));
      } else {
        newSet.push(setNote(string, offSet - 1));
      }
    }
    // M3 String (2nd String or 3rd depending on tuning)
    else if (index === 2 && instrumentType === INSTRUMENT_TYPES.GUITAR) {
      // Preserve the M3 Interval when tuning above standard 4ths (E, B, F#, C# Standard ect) on Extended Range
      if (tuningOffset < 7 && stringCount > 6) {
        newSet.push(setNote(string, offSet));
      } else {
        newSet.push(setNote(string, offSet - 1));
      }
    }
    // Lowest String
    else if (index === stringCount - 1) {
      newSet.push(setNote(string, tuningOffset));
    }
    // TPL Course
    else {
      newSet.push(setNote(string, offSet));
    }
  });
  return newSet;
}

function tuneStringsFromTemplateSTD(
  params: TuneTemplateParams,
): InstrumentString.AsObject[] {
  const { strings, stringCount, tuningOffset, instrumentType } = params;
  const newSet: InstrumentString.AsObject[] = [];
  const offSet = tuningOffset;
  strings.forEach((string, index) => {
    // Conditional for Double Course Guitar
    // M3 String (2nd String or 3rd depending on tuning)
    if (
      (index === 4 || index === 5) &&
      instrumentType === INSTRUMENT_TYPES.GUITAR_DBL
    ) {
      if (stringCount > 12 && tuningOffset < 5) {
        newSet.push(setNote(string, offSet));
      } else {
        newSet.push(setNote(string, offSet - 1));
      }
    }
    // M3 String (2nd String or 3rd depending on tuning)
    else if (index === 2 && instrumentType === INSTRUMENT_TYPES.GUITAR) {
      if (stringCount > 6 && tuningOffset < 5) {
        newSet.push(setNote(string, offSet));
      } else {
        newSet.push(setNote(string, offSet - 1));
      }
    } else {
      newSet.push(setNote(string, offSet));
    }
  });
  return newSet;
}

function tuneStringsFromTemplate(
  strings: InstrumentString.AsObject[],
  instrumentTemplate: InstrumentTemplate.AsObject,
): InstrumentString.AsObject[] {
  const params: TuneTemplateParams = {
    strings,
    stringCount: instrumentTemplate.stringCount,
    instrumentType: instrumentTemplate.instrumentType,
    tuningOffset: instrumentTemplate.tuningOffset,
  };
  switch (instrumentTemplate.tuningType) {
    case TUNING_TYPES.DROP_P4: {
      return tuneStringsFromTemplateDRP4(params);
    }
    case TUNING_TYPES.DOUBLE_DROP_MM: {
      return tuneStringsFromTemplateDDRPMM(params);
    }
    case TUNING_TYPES.DOUBLE_DROP: {
      return tuneStringsFromTemplateDDRP(params);
    }
    case TUNING_TYPES.DROP_DADGAD: {
      return tuneStringsFromTemplateDRPDADGAD(params);
    }
    case TUNING_TYPES.DADGAD: {
      return tuneStringsFromTemplateDADGAD(params);
    }
    case TUNING_TYPES.DROP: {
      return tuneStringsFromTemplateDRP(params);
    }
    default: {
      return tuneStringsFromTemplateSTD(params);
    }
  }
}

export function createStringsFromTemplateAndGauges(
  template: NoteTemplate[],
  gauges: number[],
): InstrumentString.AsObject[] {
  return template.map((noteTemplate, index) => {
    return {
      stringNumber: index + 1,
      scaleLength: 25.5,
      note: noteTemplate.note,
      octave: noteTemplate.octave,
      tensile: 400000,
      brand: gauges[index] > 0.017 ? 'DANW' : 'DAPL',
      gauge: gauges[index],
      offset: 0,
      tension: 0,
      breakingPoint: 0,
      stress: 0,
      frequency: 0,
      unitWeight: 0,
    };
  });
}

export function initTemplate(templateValues: InstrumentTemplate.AsObject) {
  const gauges =
    templateValues.stringSet.length === templateValues.stringCount
      ? templateValues.stringSet
      : BOILER_STRING_SET.slice(0, templateValues.stringCount);
  const baseTemplate = INSTRUMENT_TEMPLATES[
    templateValues.instrumentType
  ].slice(0, templateValues.stringCount);
  const strings = createStringsFromTemplateAndGauges(baseTemplate, gauges);
  const tunedSet = tuneStringsFromTemplate(strings, templateValues);
  return tunedSet.map((s) => initString(s));
}
