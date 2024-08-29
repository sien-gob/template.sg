import { ClientScope } from '../clients/clientScope';
import { Audit } from '../audits/audit';
import { TagItem } from '../tags/tagItem';

export abstract class UpdateEntity<P> {
  scope: ClientScope;
  audit: Audit;
  properties?: P;
  tags?: TagItem[];

  rowVersion?: string;
}
