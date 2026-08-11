import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import { ROLE, RoleCode } from '../constants/lookups';

/**
 * RolesGuard is the only thing standing between an authenticated USER and
 * moderator/admin endpoints. These tests pin its real behaviour — including the
 * parts that are surprising.
 */
describe('RolesGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: RolesGuard;

  const contextFor = (user?: { roleCode: string }): ExecutionContext => {
    // Stable references — getHandler()/getClass() must return the same objects
    // on every call, as the real ExecutionContext does.
    const handler = () => undefined;
    const cls = class {};
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => handler,
      getClass: () => cls,
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  describe('when the route declares no @Roles()', () => {
    it('allows the request through', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);

      expect(guard.canActivate(contextFor({ roleCode: ROLE.USER }))).toBe(true);
    });

    it('allows it even with no authenticated user at all', () => {
      // RolesGuard is NOT an authentication guard. It only enforces roles when
      // @Roles() is present. Authentication is JwtAuthGuard's job (global).
      reflector.getAllAndOverride.mockReturnValue(undefined);

      expect(guard.canActivate(contextFor(undefined))).toBe(true);
    });
  });

  describe('when the route declares @Roles()', () => {
    it('allows a user whose role is listed', () => {
      reflector.getAllAndOverride.mockReturnValue([ROLE.ADMIN, ROLE.MODERATOR]);

      expect(guard.canActivate(contextFor({ roleCode: ROLE.MODERATOR }))).toBe(
        true,
      );
    });

    it('rejects a user whose role is not listed', () => {
      reflector.getAllAndOverride.mockReturnValue([ROLE.ADMIN]);

      expect(() => guard.canActivate(contextFor({ roleCode: ROLE.USER }))).toThrow(
        ForbiddenException,
      );
    });

    it('rejects when there is no authenticated user', () => {
      reflector.getAllAndOverride.mockReturnValue([ROLE.ADMIN]);

      expect(() => guard.canActivate(contextFor(undefined))).toThrow(
        ForbiddenException,
      );
    });

    it('matches roles EXACTLY — it is not a hierarchy', () => {
      // Documented behaviour, and a real trap: SUPER_ADMIN does NOT satisfy
      // @Roles(MODERATOR). Every controller must list every role that should
      // have access. Omitting SUPER_ADMIN silently locks out the highest role.
      reflector.getAllAndOverride.mockReturnValue([ROLE.MODERATOR]);

      expect(() =>
        guard.canActivate(contextFor({ roleCode: ROLE.SUPER_ADMIN })),
      ).toThrow(ForbiddenException);
      expect(() => guard.canActivate(contextFor({ roleCode: ROLE.ADMIN }))).toThrow(
        ForbiddenException,
      );
    });

    it('reads metadata from both the handler and the controller class', () => {
      reflector.getAllAndOverride.mockReturnValue([ROLE.ADMIN]);
      const ctx = contextFor({ roleCode: ROLE.ADMIN });

      guard.canActivate(ctx);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        expect.anything(),
        [ctx.getHandler(), ctx.getClass()],
      );
    });
  });
});
