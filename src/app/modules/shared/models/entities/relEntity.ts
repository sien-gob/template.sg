import { ClientScopeInput } from '../clients/clientScope';


export abstract class RelEntity<ID, P> {
  scope: ClientScopeInput;

  relId: ID;
  properties?: P;
}
