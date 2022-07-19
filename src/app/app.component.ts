import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {TranslationService} from './translation/translation.service';
import {SizeService} from "./core/app-layout/size.service";
import {Router} from "@angular/router";
import {KeyCloakInitService} from "./auth/app-init";
import {KeycloakService} from "keycloak-angular";
import {AlertService} from "./core/ui-components/alert/alert.service";
import {AppAuthGuard} from "./auth/auth.guard";
import {User} from "./auth/models/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'foncier-portal';
  logged = false;
  activeTopbarItem?: Element;
  topbarMenuButtonClick?: boolean;
  topbarMenuActive?: boolean;
  loginPage = false;
  connectedUser?: User;
  private changeDetectorRef: ChangeDetectorRef | undefined;
  public static messageService?: MessageService;

  get home(): string {
    return this.translationService.translate('HOME.HOME');
  }

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private router: Router,
    private translationService: TranslationService,
    public appAuthGuard: AppAuthGuard,
    public keycloak: KeyCloakInitService,
    public keycloakService:KeycloakService,
    public alertService: AlertService,
  ) {
    this.appAuthGuard.userChange.subscribe(resp=>{
      this.connectedUser=resp;
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngOnDestroy() {
    this.appAuthGuard.userChange.unsubscribe();
    return;
  }

  //Here we check wich page is actualy active in order to show or not the app-header
  ngAfterViewChecked(): void {
    if (
      this.router.url === '/login'
      || this.router.url.includes('/login')
      || this.router.url === '/register'
      || this.router.url === '/lost-password'
      || this.router.url === '/reset-password'
      || this.router.url.includes('/reset-password')
      || this.router.url === '/404'
      || this.router.url === '/home'
    ) {
      this.loginPage = true;
      this.changeDetectorRef?.detectChanges();
    } else {
      this.loginPage = false;
    }
    AppComponent.messageService = this.messageService;
  }


  changeLang(lang: string): void {
    localStorage.setItem('language', lang);
    this.translationService.initService();
  }

  onResize(event: any) {
    SizeService.screenSize = {
      width: event.target.innerWidth,
      height: event.target.innerHeight,
    };
  }

  onTopbarItemClick(event: Event, item: Element) {
    this.topbarMenuButtonClick = true;
    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = new Element();
    } else {
      this.activeTopbarItem = item;
    }
    event.preventDefault();
  }

  onTopbarMenuButtonClick(event: Event) {
    this.topbarMenuButtonClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;
    event.preventDefault();
  }

}
