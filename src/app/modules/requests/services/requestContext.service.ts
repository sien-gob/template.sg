import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadAccess } from '../../access/domain/payloads';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & {
      context?: JwtPayloadAccess;
      requestId?: string;
    },
  ) {}

  getAccess(): JwtPayloadAccess | undefined {
    return this.request.context;
  }

  getRequestId(): string | undefined {
    return this.request.requestId;
  }
}
