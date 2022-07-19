import { PortalTableAction } from "src/app/core/ui-components/portal-table/portal-table-action.model";
import { Procedure } from "./procedure.model";

export class UserApplication {
  uuid?: string;
  username?: string;
  processInstanceId?: string;
  creationDate?: string;
  lastUpdateDate?: string;
  applicationReceptionDate?: string;
  archived?: boolean;
  applicantName?: string;
  status?: string;
  application?: Procedure;
  rejectionReason?: string;
  applicationNumber?: number;
  btnStatus?: PortalTableAction;


  constructor(obj: any = {}) {
    this.uuid = obj.uuid;
    this.username = obj.username;
    this.processInstanceId = obj.processInstanceId;
    this.creationDate = obj.creationDate;
    this.lastUpdateDate = obj.lastUpdateDate;
    this.applicationReceptionDate = obj.applicationReceptionDate;
    this.archived = obj.archived;
    this.applicantName = obj.applicantName;
    this.status = obj.status;
    this.application = obj.application;
    this.rejectionReason = obj.rejectionReason;
    this.applicationNumber = obj.applicationNumber;
    this.btnStatus = obj.btnStatus;
  }
}
