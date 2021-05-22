import {
  InstrumentModifiers,
  InstrumentString,
} from '../../../generated/instrument_pb';
import { initString } from './string.utils';

function scaleModify(
  minScaleLength: number,
  maxScaleLength: number = 0,
  instrumentStrings: InstrumentString.AsObject[],
): InstrumentString.AsObject[] {
  const scaleStep = maxScaleLength
    ? (maxScaleLength - minScaleLength) / (instrumentStrings.length - 1)
    : 0;
  return instrumentStrings.map((string, index) => {
    const scaleLength = minScaleLength + scaleStep * index;
    return { ...string, scaleLength };
  });
}

function brandModify(
  modifyBrand: string,
  instrumentStrings: InstrumentString.AsObject[],
): InstrumentString.AsObject[] {
  return instrumentStrings.map((s) => {
    let brand: string = s.brand;
    if (modifyBrand === 'KWNG') {
      brand = +s.gauge < 0.021 ? 'KPLG' : 'KWNG';
    } else {
      brand = +s.gauge < 0.021 ? 'DAPL' : brand;
    }
    return { ...s, brand };
  });
}

function woundThirdModify(
  woundThirdThreshold: string,
  instrumentStrings: InstrumentString.AsObject[],
): InstrumentString.AsObject[] {
  const stringLength = instrumentStrings.length;
  return instrumentStrings.map((s) => {
    let brand: string = '';
    switch (woundThirdThreshold) {
      case 'w3@17': {
        brand = instrumentStrings[stringLength - 1].brand;
        brand = +s.gauge > 0.016 ? brand : s.brand;
        break;
      }
      case 'w3@26': {
        brand = instrumentStrings[0].brand;
        brand = +s.gauge < 0.026 ? brand : s.brand;
        break;
      }
      default: {
        brand = instrumentStrings[0].brand;
        brand = +s.gauge < 0.021 ? brand : s.brand;
      }
    }
    return { ...s, brand };
  });
}

interface TensionModifyParams {
  brand: string;
  woundThirdThreshold: string;
  minTension: number;
  maxTension: number;
  strings: InstrumentString.AsObject[];
}

function tensionModify(
  params: TensionModifyParams,
): InstrumentString.AsObject[] {
  //Offset increase by string
  const isKalium = params.brand === 'KWNG';
  const threshold = isKalium
    ? 0.021
    : params.woundThirdThreshold === 'w3@17'
    ? 0.017
    : params.woundThirdThreshold === 'w3@26'
    ? 0.026
    : 0.02;
  const bassStringThreshold = 0.08;
  const tensionOffset = params.maxTension
    ? (params.maxTension - params.minTension) / (params.strings.length - 1)
    : 0;
  return params.strings.map((string, index) => {
    let newString = { ...string };
    newString.tension = 0;
    let incrementGauge = 0.004;
    let stringTension = 0;
    while (stringTension < params.minTension + tensionOffset * index) {
      let plainBrand = isKalium ? 'KPLG' : 'DAPL';
      let woundBrand = isKalium ? 'KWNG' : params.brand;
      if (incrementGauge > bassStringThreshold && woundBrand === 'DANW') {
        woundBrand = 'DAXB';
      }
      const currentThreshold = params.minTension + tensionOffset * index;
      let lowTensionCompareString = { ...newString };
      lowTensionCompareString.gauge = incrementGauge;
      lowTensionCompareString.brand =
        incrementGauge >= threshold ? woundBrand : plainBrand;
      lowTensionCompareString = initString(lowTensionCompareString);

      if (lowTensionCompareString.tension > currentThreshold) {
        newString = { ...lowTensionCompareString };
        stringTension = lowTensionCompareString.tension;
      }

      incrementGauge += +incrementGauge.toFixed(4) > 0.0135 ? 0.001 : 0.0005;
      let highTensionCompareString = { ...newString };
      highTensionCompareString.gauge = incrementGauge;
      highTensionCompareString.brand =
        incrementGauge >= threshold ? woundBrand : plainBrand;
      highTensionCompareString = initString(highTensionCompareString);

      if (
        highTensionCompareString.tension >
        params.minTension + tensionOffset * index
      ) {
        // Compare which one is closest to tension
        const lowTensionAbs = Math.abs(
          lowTensionCompareString.tension - threshold,
        );
        const highTensionAbs = Math.abs(
          highTensionCompareString.tension - threshold,
        );
        newString =
          lowTensionAbs < highTensionAbs
            ? { ...lowTensionCompareString }
            : { ...highTensionCompareString };
        stringTension = highTensionCompareString.tension;
      }
      stringTension = highTensionCompareString.tension;
    }
    return newString;
  });
}

export function modifyStringSet(
  mv: InstrumentModifiers.AsObject,
  strings: InstrumentString.AsObject[],
): InstrumentString.AsObject[] {
  let newSet = [...strings];

  //Scale Modify
  if (mv.minScaleLength !== 0) {
    newSet = scaleModify(mv.minScaleLength, mv.maxScaleLength, strings);
  }

  //Brand Modify
  if (mv.brand) {
    newSet = brandModify(mv.brand, newSet);
  }

  //Wound 3rd Modify
  if (mv.woundThirdThreshold) {
    newSet = woundThirdModify(mv.woundThirdThreshold, newSet);
  }

  //Tensile Modify
  if (mv.tensile) {
    newSet = newSet.map((s) => ({ ...s, tensile: mv.tensile }));
  }

  //Tension Modify
  if (mv.minTension) {
    newSet = tensionModify({
      brand: mv.brand,
      woundThirdThreshold: mv.woundThirdThreshold,
      minTension: mv.minTension,
      maxTension: mv.maxTension,
      strings: newSet,
    });
  }
  return newSet.map((s) => initString(s));
}
