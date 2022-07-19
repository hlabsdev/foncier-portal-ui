import {Document} from './document.model';
import {Type} from './types.model';

export class DocumentSource {
    id?: number;
    individualName?: string;
    postName?: string;
    role?: Type;
    address?: string;
    organizationName?: string;
    contactInstruction?: string;
    onlineRessource?: string;
    phone?: string;
    serviceHour ?: string;
    document ?: Document;
    constructor(obj: any = {}) {
      this.id = obj.id;
      this.individualName = obj.individualName;
      this.postName = obj.postName;
      this.role = obj.role;
      this.organizationName = obj.organizationName;
      this.address = obj.address;
      this.contactInstruction = obj.contactInstruction;
      this.onlineRessource = obj.onlineRessource;
      this.serviceHour = obj.serviceHour;
      this.phone = obj.phone;
      this.document = obj.document;
    }
  }
