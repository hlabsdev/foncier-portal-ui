import {Component} from '@angular/core';

@Component({
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  notFoundImg: string;
  constructor() {
    this.notFoundImg = "assets/img/404.png";
  }

  goToHome = () => window.location.href = '/home';
}
