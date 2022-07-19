

export class Application {
  id?: number;
  applicationDate?:string;
  applicationNumber?:string;
  referenceNumber?:number;
  status?: string;
  object?:string;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.applicationNumber = obj.applicationNumber;
    this.applicationDate =obj.applicationDate;
    this.referenceNumber= obj.applicantNumber;
    this.status = obj.status;
    this.object = obj.object;
  }
}
