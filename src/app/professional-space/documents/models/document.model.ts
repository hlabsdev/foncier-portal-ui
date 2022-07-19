import {PortalTableAction} from "src/app/core/ui-components/portal-table/portal-table-action.model";
import {DocumentSource} from "src/app/professional-space/documents/models/document-source.model";
import {Type} from "./types.model";

export class Document {
  uuid?: number;
  principalType?: Type;
  documentType?: Type;
  fileName?: Type;
  submissionDate?: Date;
  acceptationDate?: Date;
  registrationDate?: Date;
  filePath?: string;
  extension?: string;
  sourceDocuments?: DocumentSource[];
  btnExtension?: PortalTableAction;
  constructor(obj: any = {}) {
    this.uuid = obj.uuid;
    this.fileName = obj.fileName;
    this.documentType = obj.documentType;
    this.submissionDate = obj.submissionDate;
    this.principalType = obj.principalType;
    this.registrationDate = obj.registrationDate;
    this.acceptationDate = obj.acceptationDate;
    this.filePath = obj.filePath;
    this.extension=obj.extension;
    this.sourceDocuments=obj.sourceDocuments;
    this.btnExtension = obj.btnExtension;
  }

}
