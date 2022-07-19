import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';
import {TranslationService} from 'src/app/translation/translation.service';
import {AuthService} from '../auth.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {UserDto} from "../models/user-dto.model";


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  health: any;
  display = false;
  showPassword = false;
  loading = false;
  sgfLogo = "";
  user: UserDto = new UserDto();
  username = "";
  firstname = "";
  lastname = "";
  email = "";
  returnUrl = "";
  response = "";
  errorMessage = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private translator: TranslationService,
    private ngxLoader: NgxUiLoaderService,
  ) {
    this.sgfLogo = '/assets/img/logo-sgf-colored.png';
  }

  ngOnInit(): void {

  }

  submit() {
    this.user.firstName = this.firstname;
    this.user.lastName = this.lastname;
    this.user.email = this.email;
    this.user.emailVerified = true;
    this.user.enabled = true;
    this.user.username = this.username;

    this.loading = true;
    this.authService.createUser(this.user).subscribe((res => {
        this.ngxLoader.start();
        this.response = res;
        if (res.status === 201) {
          this.alertService.showAlert({
            type: 'success',
            message: this.translator.translate('REGISTER.CREATE_LOGIN'),
            title: this.translator.translate('REGISTER.SUCCESS'),
          });
          this.router.navigate(['/login']);
        }
      }),
      (error) => {
        this.loading = false;
        if (error.status === 409) {
          this.errorMessage = true;
        }
      },
    );

  }

}
