import { ClientScope } from '../clients/clientScope';
import { Audit } from '../audits/audit';
import { TagItem } from '../tags/tagItem';

export abstract class Entity<P> {
  scope: ClientScope;
  audit: Audit;
  properties?: P;
  tags?: TagItem[];

  rowVersion?: string;
}
