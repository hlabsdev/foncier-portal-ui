export class Office {
  id?: number;
  code?: string;
  name?: string;
  registry?: string;
  sigtasId?: string;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.registry = obj.registry;
    this.sigtasId = obj.sigtasId;
  }
}
