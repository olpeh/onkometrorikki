import * as t from 'io-ts';
export const BackendError = t.partial({
  error: t.string
});
