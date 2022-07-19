enum PortalActionType {
  'start',
  'open',
  'view',
  'edit',
  'delete',
  'archive',
  'validated',
  'rejected',
  'pending'
}

export class PortalTableAction {
  type: any = PortalActionType;
  mini?: boolean;
  hidden?: boolean;
  callback: any;

  constructor(obj: any = {}) {
    this.type = obj.type;
    this.mini = obj.mini??true;
    this.hidden = obj.hidden??false;
    this.callback = obj.callback;
  }
}
