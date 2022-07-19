import {Type} from '../../documents/models/types.model';

export class Applicant {
  applicantId?: string;
  applicantType?: Type;
  civility?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  region?: string;
  registredName?:string;
  enterpriseType?:string;
  streetName?: string;

  constructor(obj: any = {}) {
    this.applicantId = obj.applicantId;
    this.applicantType = obj.applicantType;
    this.civility = obj.civility;
    this.lastName = obj.lastName;
    this.region = obj.region;
    this.firstName = obj.firstName
    this.email = obj.email;
    this.registredName =obj.registredName;
    this.enterpriseType=obj.enterpriseType;
    this.streetName = obj.streetName;
  }

}
export class PhysicalApplicant {
  fiscalId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  maidenName?: string;
  emailAddress?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  nationalityCode?: string;
  nationalityId?: number;
  sex?: string;
  civility?: string;
  civilityId?: number;
  motherFirstName?: string;
  motherLastName?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  country?: string;
  countryCode?: string;
  countryId?: number;
  region?: string;
  regionId?: number;
  city?: string;
  cityId?: number;
  locality?: string;
  localityId?: number;
  streetName?: string;
  doorNo?: string;
  mobilePhone?: string;
  homePhone?: string;
  occupation?: string;
  sectorActivity?: string;
  httpCode?: number;
  resultMessage?: string;

  constructor(obj: any = {}) {
    this.fiscalId = obj.fiscalId;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.middleName = obj.middleName;
    this.lastName = obj.lastName;
    this.maidenName = obj.maidenName;
    this.emailAddress = obj.emailAddress;
    this.birthDate = obj.birthDate;
    this.birthPlace = obj.birthPlace;
    this.nationality = obj.nationality;
    this.nationalityCode = obj.nationalityCode;
    this.nationalityId = obj.nationalityId;
    this.sex = obj.sex;
    this.civility = obj.civility;
    this.civilityId = obj.civilityId;
    this.motherFirstName = obj.motherFirstName;
    this.motherLastName = obj.motherLastName;
    this.fatherFirstName = obj.fatherFirstName;
    this.fatherLastName = obj.fatherLastName;
    this.country = obj.country;
    this.countryCode = obj.countryCode;
    this.countryId = obj.countryId;
    this.region = obj.region;
    this.regionId = obj.regionId;
    this.city = obj.city;
    this.cityId = obj.cityId;
    this.locality = obj.locality;
    this.localityId = obj.localityId;
    this.streetName = obj.streetName;
    this.doorNo = obj.doorNo;
    this.mobilePhone = obj.mobilePhone;
    this.homePhone = obj.homePhone;
    this.occupation = obj.occupation;
    this.sectorActivity = obj.sectorActivity;
    this.httpCode = obj.httpCode;
    this.resultMessage = obj.resultMessage;
  }


}

export class MoralApplicant {
  fiscalId?: string;
  country?: string;
  countryCode?: string;
  countryId?: number;
  region?: string;
  regionId?: number;
  city?: string;
  cityId?: number;
  locality?: string;
  localityId?: number;
  streetName?: string;
  doorNo?: string;
  phoneNo?: string;
  registredName?: string;
  enterpriseType?: string;
  enterpriseTypeCode?: string;
  enterpriseTypeId?: number;
  startDate?: string;
  closeDate?: string;
  tradeName?: string;
  httpCode?: number;
  resultMessage?: string;

  constructor(obj: any = {}) {
    this.fiscalId=obj.fiscalId;
    this.country=obj.country;
    this.countryCode=obj.countryCode;
    this.countryId=obj.countryId;
    this.region=obj.region;
    this.regionId=obj.regionId;
    this.city=obj.city;
    this.cityId=obj.cityId;
    this.locality=obj.locality;
    this.localityId=obj.localityId;
    this.streetName=obj.streetName;
    this.doorNo=obj.doorNo;
    this.phoneNo=obj.phoneNo;
    this.registredName=obj.registredName;
    this.enterpriseType=obj.enterpriseType;
    this.enterpriseTypeCode=obj.enterpriseTypeCode;
    this.enterpriseTypeId=obj.enterpriseTypeId;
    this.startDate=obj.startDate;
    this.closeDate=obj.closeDate;
    this.tradeName=obj.tradeName;
    this.httpCode=obj.httpCode;
    this.resultMessage=obj.resultMessage;
  }
}
