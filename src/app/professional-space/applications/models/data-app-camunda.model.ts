export class DataAppCamunda {
    private applicantId: string;
    private applicantType: string;
    private applicantEmail: string;
    private referenceNumber: number;
    private applicationNumber: string;
    private applicationDate: string;
    private status: boolean;
    private applicationObject: string;
    private officeId: number;
    private nicad: string;
    private titleNumber: string;
    private nLot: string;
    private allotment: string;
    private taskId: string;
    private processInstanceId:string;
    private taskName: any;
    constructor(obj: any = {}) {
        this.applicantId = obj.applicantId;
        this.applicantType = obj.applicantType;
        this.applicantEmail = obj.applicantEmail;
        this.referenceNumber = obj.referenceNumber;
        this.applicationNumber = obj.applicationNumber;
        this.applicationDate = obj.applicationDate;
        this.applicationObject = obj.applicationObject;
        this.status = obj.status;
        this.officeId = obj.officeId;
        this.nicad = obj.nicad;
        this.titleNumber = obj.titleNumber;
        this.nLot = obj.nLot;
        this.allotment = obj.allotment;
        this.processInstanceId = obj.processInstanceId;
        this.taskId = obj.taskId;
        this.taskName = obj.taskName;
    }

    getApplicantId(): string {
        return this.applicantId;
    }
    setApplicantId(value: string) {
        this.applicantId = value;
    }
    getApplicantType(): string {
        return this.applicantType;
    }
    setApplicantType(value: string) {
        this.applicantType = value;
    }
    getApplicantEmail(): string {
        return this.applicantEmail;
    }
    setApplicantEmail(value: string) {
        this.applicantEmail = value;
    }
    getApplicationDate(): string {
        return this.applicationDate;
    }
    setApplicationDate(value: string) {
        this.applicationDate = value;
    }
    getApplicationNumber(): string {
        return this.applicationNumber;
    }
    setApplicationNumber(value: string) {
        this.applicationNumber = value;
    }
    getApplicationRefNumber(): number {
        return this.referenceNumber;
    }
    setApplicationRefNumber(value: number) {
        this.referenceNumber = value;
    }
    getApplicationObject(): string {
        return this.applicationObject;
    }
    setApplicationObject(value: string) {
        this.applicationObject = value;
    }
    getApplicationStatus(): boolean {
        return this.status;
    }
    setApplicationStatus(value: boolean) {
        this.status = value;
    }
    getOfficeId(): number {
        return this.officeId;
    }

    setOfficeId(value: number) {
        this.officeId = value;
    }

    getNicad(): string {
        return this.nicad;
    }

    setNicad(value: string) {
        this.nicad = value;
    }

    getLtPlot(): string {
        return this.titleNumber;
    }

    setLtPlot(value: string) {
        this.titleNumber = value;
    }

    getNlot(): string {
        return this.nLot;
    }

    setNlot(value: string) {
        this.nLot = value;
    }

    getAllotment(): string {
        return this.allotment;
    }

    setAllotment(value: string) {
        this.allotment = value;
    }
    getTaskId(): string {
        return this.taskId;
    }

    setTaskId(value: string) {
        this.taskId = value;
    }
    getProcessInstanceId(): string {
        return this.processInstanceId;
    }

    setProcessInstanceId(value: string) {
        this.processInstanceId = value;
    }
    getTaskName(): any {
        this.taskName = localStorage.getItem('taskName');
        return this.taskName;
    }
    setTaskName(value: any) {
        localStorage.setItem('taskName', value);
        this.taskName = this.getTaskName()
    }

}
