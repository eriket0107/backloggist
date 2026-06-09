import { Injectable } from '@nestjs/common';

export class CustomError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

@Injectable()
export class ErrorHandlerService {
  handleErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  getMessage(error: unknown): string {
    return this.handleErrorMessage(error);
  }
}
