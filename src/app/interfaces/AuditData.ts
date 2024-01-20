import { AuditUser } from "./AuditUser";

export interface AuditData {
  timeOfCreating: string;
  typeOfAudit: number;
  goalOfAudit: string;
  branchId: number;
  auditUser: AuditUser[];
}
