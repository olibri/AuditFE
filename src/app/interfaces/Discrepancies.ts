import { Iso } from "./Iso";
import { Status } from "./Status";

export interface Discrepancies{
  id: number;
  isoDiscrepancy: Iso;
  discrepancyType: string;
  anotherDiscrepancyRequirements: string;
  descriptionOfDiscrepancy: string;
  dateOfDetection: Date;
  reasonOfDiscrepancy: string;
  dateOfContorolNoticed: Date;
  status: Status;
  auditId: number;
}
