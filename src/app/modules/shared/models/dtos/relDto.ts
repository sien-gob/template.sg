import { ClientScopeInput } from '../clients/clientScope';

export abstract class RelDto<ID, P> {
  scope: ClientScopeInput;

  relId: ID;
  properties?: P;
}
