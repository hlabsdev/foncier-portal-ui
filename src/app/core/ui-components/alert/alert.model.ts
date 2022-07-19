/**
 * A model defined to provide all necesserary information for the alert component and services
* */
// export class AlertModel {
export class AlertModel {
  //The type of alert. Can be one of: `{'info', 'success', 'warn', 'error'}`
  type: string;
  //The title of the alert
  title?: string;
  //The main message or content of the alerte
  message: string;
  //Duration of the alerte in milliseconds
  duration?: number;
  //Define if the alert should disapear on it own or remain until manually closed
  permanent?: boolean;


  // constructor(obj: any = {}) {
  //   this.type = obj.type;
  //   this.title = obj.title;
  //   this.message = obj.message;
  // }
  constructor(type: string, message: string, title?: string, duration?: number, permanent?: boolean) {
    this.type = type;
    this.message = message;
    this.title = title;
    this.duration = duration;
    this.permanent = permanent;
  }
}
