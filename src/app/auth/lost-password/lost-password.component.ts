import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {AlertService} from "../../core/ui-components/alert/alert.service";
import {TranslationService} from "../../translation/translation.service";
import {UserDto} from "../models/user-dto.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss']
})
export class LostPasswordComponent implements OnInit {
  username = "";
  resetcode = "";
  errorMessage = false;
  codeError = false;
  loading = false;
  sgfLogo: string;
  emailSent = false;

  constructor(
    private auth: AuthService,
    public router: Router, // I
    private alertService: AlertService,
    private translator: TranslationService,
  ) {
    this.sgfLogo = '/assets/img/logo-sgf-colored.png';
  }

  ngOnInit(): void {
  }

  submit() {
    if (this.username == null || this.username == '') {
      this.errorMessage = true;
    } else {
      const user = new UserDto({username: this.username})
      this.loading = true;
      this.errorMessage = false;

      //Send email to the registered user
      this.auth.resetPassword(user).subscribe((response) => {
        if (response.status==200) {
          this.alertService.showAlert({
            type: 'success',
            message: this.translator.translate('LOSTPASSWORD.EMAIL_SENT'),
            title: 'RESET EMAIL SENT',
            duration: 7000,
          });
          this.emailSent = true;
        } else {
          this.alertService.showAlert({
            type: 'error',
            message: this.translator.translate('LOSTPASSWORD.ERROR'),
            title: 'AN ERROR OCCURED',
            duration: 7000,
          });
        }
        this.loading = false;
      });
    }
  }

  check() {
    if (this.resetcode == null || this.resetcode == '') {
      this.codeError = true;
    } else {
      const user = new UserDto({
        username: this.username,
        resetCode: this.resetcode,
      })
      this.loading = true;
      this.codeError = false;

      //Navigate to change password page
      this.auth.checkResetCode(user).subscribe((response) => {
        if (response.status==200) {
          this.router.navigate(['/reset-password'], {queryParams: {username: this.username}}).then(
            ()=>{

              this.alertService.showAlert({
                type: 'success',
                message: this.translator.translate('LOSTPASSWORD.CODE_VERIFIED'),
                title: 'RESET EMAIL SENT',
                duration: 7000
              });
            }
          );
          this.alertService.showAlert({
            type: 'success',
            message: this.translator.translate('LOSTPASSWORD.CODE_VERIFIED'),
            title: 'RESET EMAIL SENT',
            duration: 7000,
          });
        } else {
          this.codeError = true;
        }
        this.loading = false;
      });
    }
  }

}
