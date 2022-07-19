export class PortalDialogTab {
  name: string;
  required: boolean;
  disabled?: boolean;
  warning?: boolean;

  constructor(obj: any = {}) {
    this.name = obj.name;
    this.required = obj.required;
    this.disabled = obj.disabled;
    this.warning = obj.warning;
  }
}

export class PortalDialogConfig {
  display?: boolean;
  title?: string;
  tabs?: PortalDialogTab[] = [];
  canSave?: boolean;
  isDisable? :boolean;
  showAction: boolean;
  hideSave?: boolean;

  constructor(obj: any = {}) {
    this.display = obj.display;
    this.title = obj.title;
    this.tabs = obj.tabs;
    this.canSave = obj.canSave;
    this.showAction = obj.showAction;
    this.isDisable = obj.isDisable;
    this.hideSave = obj.hideSave;
  }
}
