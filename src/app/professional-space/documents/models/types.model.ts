export class Type {
    uuid?:number;
    code?: string;
    value?: string;

    constructor(obj: any = {}) {
        this.uuid = obj.uuid;
        this.code =obj.code;
        this.value = obj.value;
    }
}

