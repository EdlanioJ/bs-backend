import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const contextMock: ExecutionContext = createMock<ExecutionContext>();

  beforeEach(() => {
    guard = new RolesGuard(new Reflector());
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles returned', () => {
      const result = guard.canActivate(contextMock);
      expect(result).toBe(true);
    });
  });
});
