import { CallHandler, ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

/**
 * TransformInterceptor wraps every response in the global envelope and decides
 * between the paginated and single-resource shapes by DUCK-TYPING the service's
 * return value.
 *
 * That detection is the fragile part: it requires all four of
 * data/total/page/limit. Drop any one and the interceptor silently takes the
 * single-resource branch — `meta` disappears and the payload shape changes,
 * with no error anywhere. Frontend pagination just stops working.
 *
 * These tests pin both branches and the exact degradation between them.
 */
describe('TransformInterceptor', () => {
  const interceptor = new TransformInterceptor();
  const ctx = {} as ExecutionContext;
  const next = (value: unknown): CallHandler => ({ handle: () => of(value) });

  const run = (value: unknown) =>
    firstValueFrom(interceptor.intercept(ctx, next(value)) as never) as Promise<
      Record<string, any>
    >;

  describe('single-resource branch', () => {
    it('wraps a plain object', async () => {
      const result = await run({ id: '1', title: 'x' });

      expect(result).toMatchObject({
        success: true,
        data: { id: '1', title: 'x' },
      });
    });

    it('unwraps a service that returned { data, message }', async () => {
      const result = await run({ data: { id: '1' }, message: 'Created' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1' });
      expect(result.message).toBe('Created');
    });

    it('passes null through without crashing', async () => {
      const result = await run(null);

      expect(result).toMatchObject({ success: true, data: null });
    });
  });

  describe('paginated branch', () => {
    const paginated = {
      data: [{ id: '1' }, { id: '2' }],
      total: 180,
      page: 1,
      limit: 2,
      totalPages: 90,
      hasNextPage: true,
      hasPreviousPage: false,
    };

    it('lifts the array to `data` and pagination fields to `meta`', async () => {
      const result = await run(paginated);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.meta).toEqual({
        total: 180,
        page: 1,
        limit: 2,
        totalPages: 90,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('is detected even when the page is empty', async () => {
      const result = await run({ data: [], total: 0, page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.meta).toMatchObject({ total: 0, page: 1, limit: 10 });
    });
  });

  describe('the silent-degradation trap', () => {
    // Each case drops exactly one required key. The interceptor stops
    // recognising the response as paginated and falls through to the
    // single-resource branch.
    //
    // The failure is nastier than it first looks: because that branch unwraps
    // `data.data`, the ARRAY still comes through intact. Only `meta` vanishes.
    // So the list renders normally and only pagination breaks — nothing errors,
    // nothing logs, and the bug surfaces as "page 2 does nothing".
    it.each(['total', 'page', 'limit'])(
      'silently loses `meta` when `%s` is missing, while the list still renders',
      async (missing) => {
        const partial: Record<string, unknown> = {
          data: [{ id: '1' }],
          total: 5,
          page: 1,
          limit: 10,
        };
        delete partial[missing];

        const result = await run(partial);

        expect(result.meta).toBeUndefined();
        expect(result.data).toEqual([{ id: '1' }]); // array survives — that is the trap
      },
    );

    it('treats a non-array `data` as a single resource', async () => {
      const result = await run({
        data: { id: '1' },
        total: 1,
        page: 1,
        limit: 10,
      });

      expect(result.meta).toBeUndefined();
      expect(result.data).toEqual({ id: '1' });
    });
  });
});
