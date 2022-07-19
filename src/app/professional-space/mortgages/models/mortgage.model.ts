export class Mortgage {
    version: number;
    titleId: string;
    registryCode: string;
    titleNumber: string;
    interestRate:number;
    ranking:number;
    mortgageAmount:string;
    mortgageRecordId:string;
    principalRestrictionType: string;
    restrictionType: string;
    principalRightType:string;
    rightType: string;
    mortgageHolder:string;
    rightHolder: string;
 
    constructor(obj: any = {}) {
        this.version=obj.version;
        this.titleId = obj.titleId;
        this.registryCode = obj.registryCode;
        this.titleNumber = obj.titleNumber;
        this.interestRate=obj.interestRate;
        this.ranking=obj.ranking;
        this.mortgageAmount=obj.mortgageAmount;
        this.mortgageRecordId=obj.mortgageRecordId;
        this.principalRestrictionType = obj.principalRestrictionType;
        this.restrictionType = obj.restrictionType;
        this.principalRightType=obj.principalRightType;
        this.rightType = obj.rightType;
        this.mortgageHolder=obj.mortgageHolder;
        this.rightHolder = obj.rightHolder;
    }
}
