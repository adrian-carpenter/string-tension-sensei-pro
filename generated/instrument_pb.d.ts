// package: instrument
// file: instrument.proto

import * as jspb from "google-protobuf";

export class InstrumentString extends jspb.Message {
  getStringNumber(): number;
  setStringNumber(value: number): void;

  getScaleLength(): number;
  setScaleLength(value: number): void;

  getNote(): string;
  setNote(value: string): void;

  getOctave(): number;
  setOctave(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getGauge(): number;
  setGauge(value: number): void;

  getBrand(): string;
  setBrand(value: string): void;

  getTension(): number;
  setTension(value: number): void;

  getBreakingPoint(): number;
  setBreakingPoint(value: number): void;

  getStress(): number;
  setStress(value: number): void;

  getFrequency(): number;
  setFrequency(value: number): void;

  getUnitWeight(): number;
  setUnitWeight(value: number): void;

  getTensile(): number;
  setTensile(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentString.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentString): InstrumentString.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentString, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentString;
  static deserializeBinaryFromReader(message: InstrumentString, reader: jspb.BinaryReader): InstrumentString;
}

export namespace InstrumentString {
  export type AsObject = {
    stringNumber: number,
    scaleLength: number,
    note: string,
    octave: number,
    offset: number,
    gauge: number,
    brand: string,
    tension: number,
    breakingPoint: number,
    stress: number,
    frequency: number,
    unitWeight: number,
    tensile: number,
  }
}

export class InstrumentTemplate extends jspb.Message {
  getInstrumentType(): string;
  setInstrumentType(value: string): void;

  getStringCount(): number;
  setStringCount(value: number): void;

  getTuningType(): string;
  setTuningType(value: string): void;

  getTuningOffset(): number;
  setTuningOffset(value: number): void;

  clearStringSet(): void;
  getStringSet(): Array<number>;
  setStringSet(value: Array<number>): void;
  addStringSet(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentTemplate.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentTemplate): InstrumentTemplate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentTemplate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentTemplate;
  static deserializeBinaryFromReader(message: InstrumentTemplate, reader: jspb.BinaryReader): InstrumentTemplate;
}

export namespace InstrumentTemplate {
  export type AsObject = {
    instrumentType: string,
    stringCount: number,
    tuningType: string,
    tuningOffset: number,
    stringSet: Array<number>,
  }
}

export class InstrumentModifiers extends jspb.Message {
  getMinScaleLength(): number;
  setMinScaleLength(value: number): void;

  getMaxScaleLength(): number;
  setMaxScaleLength(value: number): void;

  getMinTension(): number;
  setMinTension(value: number): void;

  getMaxTension(): number;
  setMaxTension(value: number): void;

  getBrand(): string;
  setBrand(value: string): void;

  getWoundThirdThreshold(): string;
  setWoundThirdThreshold(value: string): void;

  getTensile(): number;
  setTensile(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentModifiers.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentModifiers): InstrumentModifiers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentModifiers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentModifiers;
  static deserializeBinaryFromReader(message: InstrumentModifiers, reader: jspb.BinaryReader): InstrumentModifiers;
}

export namespace InstrumentModifiers {
  export type AsObject = {
    minScaleLength: number,
    maxScaleLength: number,
    minTension: number,
    maxTension: number,
    brand: string,
    woundThirdThreshold: string,
    tensile: number,
  }
}

