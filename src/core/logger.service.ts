import { Injectable, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  constructor(@Optional() private readonly context?: string) {}
  log(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
}
