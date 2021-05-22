import {
  InstrumentModifiers,
  InstrumentString,
  InstrumentTemplate,
} from '../../generated/instrument_pb';
import { INSTRUMENT_TEMPLATES } from './constants/instrument_templates';
import { BOILER_STRING_SET } from './constants/string_sets';
import { proxy } from 'valtio';
import { modifyStringSet } from './utils/instrument_modifiers.utils';
import { newStringToSet } from './utils/instrument.utils';
import {
  initTemplate,
  shiftTuneInstrument,
} from './utils/instrument_template.utils';

function initStrings(): InstrumentString.AsObject[] {
  const template = INSTRUMENT_TEMPLATES.guitar.slice(1, 7);
  const defaultGauges = BOILER_STRING_SET.slice(0, 6);
  const baseInstrumentStrings = template.map((noteTemplate, index) => {
    return {
      stringNumber: index + 1,
      scaleLength: 25.5,
      note: noteTemplate.note,
      octave: noteTemplate.octave,
      tensile: 400000,
      brand: defaultGauges[index] > 0.017 ? 'DANW' : 'DAPL',
      gauge: defaultGauges[index],
      offset: 0,
      tension: 0,
      breakingPoint: 0,
      stress: 0,
      frequency: 0,
      unitWeight: 0,
    };
  });
  return modifyStringSet(initModifiers(), baseInstrumentStrings);
}

function initModifiers(): InstrumentModifiers.AsObject {
  return {
    minScaleLength: 0,
    maxScaleLength: 0,
    minTension: 0,
    maxTension: 0,
    brand: 'DANW',
    woundThirdThreshold: 'w3@17',
    tensile: 400000,
  };
}

interface CalculatorModel {
  strings: InstrumentString.AsObject[];
  modifiers: InstrumentModifiers.AsObject;
  updateString: (instrumentString: InstrumentString.AsObject) => void;
  removeString: () => void;
  addString: (addHigher: boolean) => void;
  generateTemplate: (template: InstrumentTemplate.AsObject) => void;
  modifyInstrument: (modifiers: InstrumentModifiers.AsObject) => void;
  shiftTune: (isUp: boolean) => void;
  clearModifiers: () => void;
}

const calculatorModel: CalculatorModel = {
  strings: initStrings(),
  modifiers: initModifiers(),
  removeString: () => {
    const { strings, modifiers } = calculatorStore;
    calculatorStore.strings = modifyStringSet(modifiers, strings.slice(0, -1));
  },
  addString: (addHigher = false) => {
    const { strings, modifiers } = calculatorStore;
    calculatorStore.strings = modifyStringSet(
      modifiers,
      newStringToSet(strings, addHigher),
    );
  },
  updateString: (instrumentString) => {
    const { strings, modifiers } = calculatorStore;
    const newSet = strings.filter(
      (s) => s.stringNumber !== instrumentString.stringNumber,
    );
    newSet.push(instrumentString);
    calculatorStore.strings = modifyStringSet(
      modifiers,
      newSet.sort((a, b) => (a.stringNumber < b.stringNumber ? -1 : 1)),
    );
  },
  generateTemplate: (template) => {
    const { modifiers } = calculatorStore;
    calculatorStore.strings = modifyStringSet(
      modifiers,
      initTemplate(template),
    );
  },
  modifyInstrument: (modifiers) => {
    const { strings } = calculatorStore;
    calculatorStore.modifiers = { ...modifiers };
    calculatorStore.strings = modifyStringSet(modifiers, strings);
  },
  shiftTune: (isUp) => {
    const { modifiers, strings } = calculatorStore;
    calculatorStore.strings = modifyStringSet(
      modifiers,
      shiftTuneInstrument({ strings, isUp }),
    );
  },
  clearModifiers: () => {
    calculatorStore.modifiers = initModifiers();
  },
};

export const calculatorStore = proxy(calculatorModel);
