// package: echo
// file: echo.proto

import * as echo_pb from "./echo_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EchoServiceGetEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof echo_pb.Echo;
  readonly responseType: typeof echo_pb.Echo;
};

export class EchoService {
  static readonly serviceName: string;
  static readonly GetEcho: EchoServiceGetEcho;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class EchoServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getEcho(
    requestMessage: echo_pb.Echo,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: echo_pb.Echo|null) => void
  ): UnaryResponse;
  getEcho(
    requestMessage: echo_pb.Echo,
    callback: (error: ServiceError|null, responseMessage: echo_pb.Echo|null) => void
  ): UnaryResponse;
}

