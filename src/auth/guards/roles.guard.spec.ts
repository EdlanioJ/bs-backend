import { ExecutionContext } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../entities';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: DeepMocked<Reflector>;
  const contextMock = createMock<ExecutionContext>();

  beforeEach(() => {
    reflector = createMock<Reflector>();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles returned', async () => {
      reflector.getAllAndOverride.mockReturnValue(null);
      const result = await guard.canActivate(contextMock);
      expect(result).toBeTruthy();
    });

    it('should return false if user role not in returned roles', async () => {
      const roles: Role[] = [Role.USER, Role.ADMIN];
      contextMock.switchToHttp().getRequest.mockReturnValue({
        user: {
          role: Role.MANAGER,
        },
      });
      reflector.getAllAndOverride.mockReturnValue(roles);
      const result = await guard.canActivate(contextMock);
      expect(result).toBeFalsy();
    });
  });
});
