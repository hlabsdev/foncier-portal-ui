import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {AppComponent} from "../../../app.component";
import {AlertModel} from "./alert.model";
import {Message} from "primeng/api/message";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  constructor(private messageService: MessageService) {
    this.messageService.messageObserver.subscribe();
  }

  //Shows a toast item
  showAlert (alerte: AlertModel): void {
    AppComponent.messageService?.add({
      severity:alerte.type.toLowerCase(),
      summary:alerte.title??alerte.type.toUpperCase(),
      detail:alerte.message,
      life:alerte.duration??5000,
      sticky:alerte.permanent??false,
    });
  }

  showMultiple (alertes: AlertModel[]){
    const messages: Message[] = [];
    alertes.forEach((e)=>{
      messages.push({
        severity:e.type.toLowerCase(),
        summary:e.title??e.type.toUpperCase(),
        detail:e.message,
        life:e.duration??5000,
        sticky:e.permanent??false,
      });
    });
    AppComponent.messageService?.addAll(messages);
  }

  // Closes the last toast item
  closeAlert (): void {
    this.messageService.clear();
  }

}
