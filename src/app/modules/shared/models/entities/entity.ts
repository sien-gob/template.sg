import { ClientScopeInput } from '../clients/clientScope';
import { AuditInput } from '../audits/audit';
import { TagItem } from '../tags/tagItem';

export abstract class Entity<ID, P> {
  scope: ClientScopeInput;
  audit: AuditInput;
  id: ID;
  properties?: P;
  tags?: TagItem[];
}
