import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {UserDto} from "../models/user-dto.model";
import {AlertService} from "../../core/ui-components/alert/alert.service";
import {TranslationService} from "../../translation/translation.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  health: any;
  display = false;
  showConfirmPassword = false;
  showPassword = false;
  sgfLogo: string;
  username = "";
  password = "";
  passwordConfirm = "";
  loading: any;
  errorMessage = false;
  emptyMessage = false;
  isToken = false;
  token = '';

  constructor(
    private translator: TranslationService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService,
  ) {
    this.sgfLogo = '/assets/img/logo-sgf-colored.png';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    // this.route.params.subscribe(params => {
      if (params['username'] != null || params['username'] != '') {
        this.isToken = true;
        this.username = params['username'];
      }
      console.log('The reset username is: ', this.username);
    });
  }

  submit() {

    if (this.password == '' || this.passwordConfirm == '') {
      this.emptyMessage = true;
      this.errorMessage = false;
    } else if (this.password !== this.passwordConfirm) {
      this.errorMessage = true;
      this.emptyMessage = false;
    } else {
      const user = new UserDto();
      user.username = this.username
      user.password = this.password;
      this.loading = true;
      this.errorMessage = false;
      this.emptyMessage = false;
      this.auth.changePassword(user).subscribe((response) => {
        if (response.status == 200) {
          this.alertService.showAlert({
            type: 'success',
            message: this.translator.translate('RESET.SUCCESS'),
            title: 'RESET SUCCESS',
            permanent: true,
          });
          this.router.navigate(['/login']);
        } else {
          this.alertService.showAlert({
            type: 'success',
            message: this.translator.translate('RESET.FAILED'),
            title: 'RESET SUCCESS',
            permanent: true,
          });
        }
        this.loading = false;
      });
    }
  }
}
