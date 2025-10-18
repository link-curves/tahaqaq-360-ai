import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Check if this is a paginated result (has data array and pagination fields)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          Array.isArray(data.data) &&
          'total' in data &&
          'page' in data &&
          'limit' in data
        ) {
          // Return paginated response with pagination fields at top level
          return {
            success: true,
            data: data.data,
            meta: {
              total: data.total,
              page: data.page,
              limit: data.limit,
              totalPages: data.totalPages,
              hasNextPage: data.hasNextPage,
              hasPreviousPage: data.hasPreviousPage,
            },
          };
        }

        // Handle regular responses
        return {
          success: true,
          data: data?.data !== undefined ? data.data : data,
          message: data?.message,
          meta: data?.meta,
        };
      }),
    );
  }
}
