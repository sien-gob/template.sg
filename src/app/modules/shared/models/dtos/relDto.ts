import { Audit } from '../audits/audit';
import { ClientScope } from '../clients/clientScope';

export abstract class RelDto<ID, P> {
  scope: ClientScope;
  audit: Audit;

  relId: ID;
  properties?: P;
}
