import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { baseQuery } from './base';

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (!refreshResult.error) {
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    }
    window.location.replace('/login');
  }
  return result;
};
