import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * JwtAuthGuard is bound globally via APP_GUARD, so the API is deny-by-default:
 * every endpoint requires a JWT unless it opts out with @Public().
 *
 * Both directions matter. Losing the deny default exposes the whole API;
 * losing the @Public() opt-out silently 401s the entire public website.
 */
describe('JwtAuthGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: JwtAuthGuard;
  let superCanActivate: jest.SpyInstance;

  const context = (): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({}) }),
      getHandler: () => () => undefined,
      getClass: () => class {},
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new JwtAuthGuard(reflector as unknown as Reflector);

    // The passport AuthGuard('jwt') implementation sits on the prototype chain.
    // Stub it so these tests exercise our logic, not passport's.
    superCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it('bypasses JWT verification when @Public() is present', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    expect(guard.canActivate(context())).toBe(true);
    expect(superCanActivate).not.toHaveBeenCalled();
  });

  it('enforces JWT verification when @Public() is absent', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    guard.canActivate(context());

    expect(superCanActivate).toHaveBeenCalledTimes(1);
  });

  it('enforces JWT verification when @Public() is explicitly false', () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    guard.canActivate(context());

    expect(superCanActivate).toHaveBeenCalledTimes(1);
  });

  describe('handleRequest', () => {
    it('returns the user when authentication succeeded', () => {
      const user = { id: 'u1' };

      expect(guard.handleRequest(null, user, null)).toBe(user);
    });

    it('throws when no user was resolved', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        UnauthorizedException,
      );
    });

    it('rethrows the original error when passport supplied one', () => {
      const original = new Error('token expired');

      expect(() => guard.handleRequest(original, null, null)).toThrow(original);
    });

    it('throws even when passport reports no error but also no user', () => {
      // Guards against a "falsy err means success" refactor.
      expect(() => guard.handleRequest(undefined, undefined, null)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
