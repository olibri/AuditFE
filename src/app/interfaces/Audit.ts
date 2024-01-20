import { Branch } from "./Branch";
import { User } from "./User";

export interface Audit{
  id: number;
  timeOfCreating: string;
  typeOfAudit: string;
  goalOfAudit: string;
  statusName: string;
  branch: Branch;
  auditUser: User;
}
