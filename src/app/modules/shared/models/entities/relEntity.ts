import { AuditInput } from '../audits/audit';
import { ClientScopeInput } from '../clients/clientScope';


export abstract class RelEntity<ID, P> {
  scope: ClientScopeInput;
  audit: AuditInput;

  relId: ID;
  properties?: P;
}
