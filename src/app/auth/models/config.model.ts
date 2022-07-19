export class Config  {
    keyCloakUrl: string;
    keyCloakRealm: string;
    keyCloakClientId: string;

    constructor(obj: any = {}) {
        this.keyCloakUrl = obj.codeListID;
        this.keyCloakRealm = obj.value;
        this.keyCloakClientId = obj.type;
    }
}
