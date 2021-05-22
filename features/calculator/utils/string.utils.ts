import { InstrumentString } from '../../../generated/instrument_pb';
import { STRING_GAUGE_UNIT_WEIGHT } from '../constants/string_gauge_unit_weight';
import { NOTE_OFFSET } from '../constants/note_offset';

export function formatGauge(gauge: number): string {
  return gauge.toFixed(4).replace(/0$/, '');
}

export function calculateOffset(
  currentString: InstrumentString.AsObject,
): number {
  return NOTE_OFFSET[currentString.note];
}

export function calculateFrequency(
  currentString: InstrumentString.AsObject,
): number {
  // A4_Offset from C5 = 3
  // Base_Octave = 5 (C5)
  // Formula (string.octave - base_octave) * 12 + a4_offset + currentstring.offset
  const halfstep = (currentString.octave - 5) * 12 + 3 + currentString.offset;
  const A4Constant = Math.pow(2, 1 / 12);
  const frequency = (440 * Math.pow(A4Constant, halfstep)).toFixed(2);
  return +frequency;
}

export function calculateStringTension(
  currentString: InstrumentString.AsObject,
): number {
  const { unitWeight, scaleLength, frequency } = currentString;
  return parseFloat(
    ((unitWeight * Math.pow(2 * +scaleLength * frequency, 2)) / 386.4).toFixed(
      2,
    ),
  );
}

export function calculateBreakingPoint(
  currentString: InstrumentString.AsObject,
): number {
  return +(
    currentString.tensile *
    Math.PI *
    Math.pow(+currentString.gauge / 2, 2)
  ).toFixed(2);
}

export function calculateBreakingTension(
  currentString: InstrumentString.AsObject,
): number {
  const breakingPoint = (
    currentString.tensile *
    Math.PI *
    Math.pow(+currentString.gauge / 2, 2)
  ).toFixed(2);
  return currentString.tension / +breakingPoint;
}

export function calculateUnitWeight(
  currentString: InstrumentString.AsObject,
): number {
  const { brand, gauge } = currentString;
  const brandMass = STRING_GAUGE_UNIT_WEIGHT[brand];
  const gaugeIndex = (+gauge).toFixed(4).replace(/^0+/, '').replace(/0$/, '');
  return brandMass[gaugeIndex] || imaginaryUnitWeight(brand, +gauge);
}

export function imaginaryUnitWeight(brand: string, gauge: number): number {
  const brandUnitWeight = { ...STRING_GAUGE_UNIT_WEIGHT[brand] };
  const brandGauges = Object.keys(brandUnitWeight)
    .map((val: string) => parseFloat(val))
    .reverse();
  const brandKeys = Object.keys(brandUnitWeight).reverse();
  const brandGaugeLength = brandGauges.length;
  let highGauge = 0;
  let lowGauge = 0;
  let lowBMKey = '';
  let highBMKey = '';
  if (gauge >= brandGauges[brandGaugeLength - 1]) {
    highGauge = brandGauges[brandGaugeLength - 1];
    lowGauge = brandGauges[brandGaugeLength - 2];
    highBMKey = brandKeys[brandGaugeLength - 1];
    lowBMKey = brandKeys[brandGaugeLength - 2];
  } else if (gauge <= brandGauges[0]) {
    highGauge = brandGauges[1];
    lowGauge = brandGauges[0];
    highBMKey = brandKeys[1];
    lowBMKey = brandKeys[0];
  } else {
    for (let k = 0; k < brandGaugeLength; k++) {
      if (gauge < brandGauges[k]) {
        highGauge = brandGauges[k];
        lowGauge = brandGauges[k - 1];
        highBMKey = brandKeys[k];
        lowBMKey = brandKeys[k - 1];
        break;
      }
    }
  }
  const lowUnitWeight = brandUnitWeight[lowBMKey];
  const highUnitWeight = brandUnitWeight[highBMKey];
  return (
    lowUnitWeight +
    ((highUnitWeight - lowUnitWeight) / (highGauge - lowGauge)) *
      (gauge - lowGauge)
  );
}

export function initString(
  baseString: InstrumentString.AsObject,
): InstrumentString.AsObject {
  const updatedString = { ...baseString };
  // Needs to be done in this order
  // Uses mutation to avoid multiple object spreading
  updatedString.offset = calculateOffset(updatedString);
  updatedString.frequency = calculateFrequency(updatedString);
  updatedString.unitWeight = calculateUnitWeight(updatedString);
  updatedString.tension = calculateStringTension(updatedString);
  updatedString.breakingPoint = calculateBreakingPoint(updatedString);
  updatedString.stress = calculateBreakingTension(updatedString);
  return updatedString;
}
