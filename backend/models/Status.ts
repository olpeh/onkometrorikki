import { BackendError } from './BackendError';
import * as t from 'io-ts';
import { Reason } from './Reason';

export type Status = t.TypeOf<typeof Status>;

const PartialStatus = t.type({
  success: t.boolean,
  broken: t.boolean,
  reasons: t.array(Reason)
});

const Status = t.intersection([PartialStatus, BackendError]);
