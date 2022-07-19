import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../../app.component";
import {AppAuthGuard} from "../../../auth/auth.guard";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MenuItem} from "primeng/api";
import {TranslationService} from "../../../translation/translation.service";
import {AlertService} from "../../ui-components/alert/alert.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  displaySideBar = false;
  alarmImg = "assets/img/alarm.png";
  applicationMenu?: MenuItem;
  mortgageMenu?: MenuItem;
  userMenu?: MenuItem;
  langMenu?: MenuItem;
  notifs?: MenuItem[];
  portalYellow = '#c6a531';
  portalBrown = '#583a14';
  grandientColor = 'linear-gradient(200deg, ' + this.portalBrown + ' 0%, ' + this.portalYellow + ' 100%)';
  gradientBackground = {
    'background-color': this.portalBrown,
    'background-image': this.grandientColor,
  };
  menuItemStyle = {
    'background-color': this.portalYellow,
    'color': 'white',
    'text-decoration': 'white',
    '.p-menuitem-text': {
      'color': 'white',
      'text-decoration': 'white',
    }
  };

  constructor(
    public router: Router,
    public app: AppComponent,
    public appAuthGuard: AppAuthGuard,
    public _domSanitizer: DomSanitizer,
    public tranaslator: TranslationService,
    public alertService: AlertService,
  ) {
    router.events.subscribe(() => this.displaySideBar = false);
  }

  ngOnInit() {
    this.isAuthenticated = this.app.keycloak.isAuthenticated();
    this.reloadParamsHeader();
  }

  reloadParamsHeader() {
    this.displaySideBar = false;
    this.applicationMenu = {
      label: this.tranaslator.translate('HEADER.APPLICATION'),
      items: [
        {
          label: this.tranaslator.translate('HEADER.NEW_APPLICATION'),
          routerLink: [`/${this.getCurrentSpace()}/procedure-list`],
        },
        {
          label: this.tranaslator.translate('HEADER.APPLICATION_LIST'),
          routerLink: [`/${this.getCurrentSpace()}/application-list`],
        },
        {
          label: this.tranaslator.translate('HEADER.APPLICATION_HISTORY'),
          routerLink: [`/${this.getCurrentSpace()}/archived-application-list`],
        },
      ],
    };
    this.mortgageMenu = {
      label: this.tranaslator.translate('HEADER.MORTGAGE'),
      routerLink: ['/professional-space/mortgage-list'],
    };
    this.userMenu = {
      label: this.app.connectedUser?.username,
      // icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: this.tranaslator.translate('USER.PROFILE.PROFILE'),
          // routerLink: ['/home'],
        },
        {
          label: this.tranaslator.translate('USER.PROFILE.SETTINGS'),
          // routerLink: ['/home'],
        },
        {
          label: this.tranaslator.translate('HEADER.LOGOUT'),
          // routerLink: ['/home'],
          command: () => {
            this.doLogout();
          },
        },
      ],
    };
    this.langMenu = {
      label: this.tranaslator.translate('HEADER.LANG'),
      icon: 'pi pi-fw pi-globe',
      items: [
        {
          label: this.tranaslator.translate('HEADER.LANG.FRENCH'),
          command: () => {
            this.app.changeLang('fr-SN');
            this.reloadParamsHeader();
            this.notifyLangChange('fr');
          },
        },
        {
          label: this.tranaslator.translate('HEADER.LANG.ENGLISH'),
          command: () => {
            this.app.changeLang('en');
            this.reloadParamsHeader();
            this.notifyLangChange('en');
          },
        },
      ],
    };
    this.initNotif();
  }

  notifyLangChange(next: string){
    const actual= next=='en'? this.tranaslator.translate('HEADER.LANG.ENGLISH'):this.tranaslator.translate('HEADER.LANG.FRENCH');
    this.alertService.showAlert({
      type: 'success',
      title: this.tranaslator.translate('HEADER.LANG.CHANGED'),
      message: this.tranaslator.translate('HEADER.LANG.CHANGE_SUCCESS', {actual}),
    });
  }

  initNotif() {
    const notifSeparator = {
      separator: true,
    };
    const notifClearer = {
      icon: 'pi pi-trash',
      label: 'CLEAR ALL',
      style: {'text-align': 'center'},
      command: () => {
        this.notifs = [];
        this.notifs = [
          {
            label: 'NOTHING HERE FOR THE MOMENT',
            style: {'text-align': 'center'},
          }
        ];
      },
    }
    //Just some random suff here
    this.notifs = [
      {
        icon: 'pi pi-bell',
        label: "Activation de compte",
      },
      {
        icon: 'pi pi-bell',
        label: "Update password",
      },
      {
        label: "Tache en attente",
        icon: 'pi pi-bell',
        tooltip: "Tache en attente"
      },
      notifSeparator,
      notifClearer,
    ];
  }

  addNotif (){
    //TODO: Create this function to add new notification to the notif stack. Make to sure to add it before the separator and the clearer
  }

  getCurrentSpace(){
    return localStorage.getItem('currentSpace') || 'public-space';
  }

  isPublic(){
    return !(localStorage.getItem('currentSpace') ==='professional-space');
  }

  /**
   * destroy the currentUser saved in the localStorage
   */
  doLogout() {
    //For the real logout later
    const parsedUrl = new URL(window.location.href);
    this.app.keycloakService.logout(parsedUrl.origin + '/home').then(() => {
        this.appAuthGuard.setUser(null);
    });
    localStorage.removeItem('token');
    sessionStorage.removeItem('steperState');
    sessionStorage.removeItem('currentSpace');
  }

  handleSettingsRouting(setting: string) {
    this.router.navigate(['/profile-settings'], {queryParams: {setting}}).then(() => null);
  }

  transform(url: string) {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sidebar() {
    this.displaySideBar = !this.displaySideBar;
  }

}
