// package: echo
// file: echo.proto

import * as jspb from "google-protobuf";

export class Echo extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Echo.AsObject;
  static toObject(includeInstance: boolean, msg: Echo): Echo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Echo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Echo;
  static deserializeBinaryFromReader(message: Echo, reader: jspb.BinaryReader): Echo;
}

export namespace Echo {
  export type AsObject = {
    id: number,
    message: string,
  }
}

