
export class Procedure {
  uuid?: string;
  name?: string;
  function?: string;
  domain?: string;
  code?: string;
  processId?:string;
  publiclyAvailable?: boolean;
  requisitionRequired?: boolean;

  constructor(obj: any = {}) {
    this.uuid = obj.uuid;
    this.name = obj.name;
    this.function = obj.function;
    this.domain = obj.domain;
    this.code = obj.code;
    this.processId=obj.processId;
    this.publiclyAvailable = obj.publiclyAvailable;
    this.requisitionRequired = obj.requisitionRequired;
  }
}
