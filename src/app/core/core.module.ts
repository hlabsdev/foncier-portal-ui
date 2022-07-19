import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from "./not-found/not-found.component";
import {TranslationModule} from "../translation/translation.module";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";
import {HeaderComponent} from './app-layout/header/header.component';
import {SidebarModule} from "primeng/sidebar";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {MenubarModule} from "primeng/menubar";
import {MegaMenuModule} from "primeng/megamenu";
import {MenuModule} from "primeng/menu";
import {ReactiveFormsModule} from "@angular/forms";
import {ButtonComponent} from './ui-components/form-elements/button/button.component';
import {PortalTableComponent} from './ui-components/portal-table/portal-table.component';
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RippleModule} from "primeng/ripple";
import {PortalDialogComponent} from './ui-components/portal-dialog/portal-dialog.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpReqInterceptor} from "./utils/http.interceptor";
import {FooterComponent} from './app-layout/footer/footer.component';
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {ProgressBarModule} from "primeng/progressbar";
import {GeoportalComponent} from './geoportal/geoportal.component';
import {GisOverviewComponent} from './geoportal/gis-overview/gis-overview.component';
import {NavBarNavigationComponent} from './nav-bar-navigation/nav-bar-navigation.component';
import {SidemenuComponent} from "./app-layout/sidemenu/sidemenu.component";


// @ts-ignore
@NgModule({
    declarations: [
        NotFoundComponent,
        HeaderComponent,
        ButtonComponent,
        PortalTableComponent,
        PortalDialogComponent,
        FooterComponent,
        GeoportalComponent,
        GisOverviewComponent,
        NavBarNavigationComponent,
        SidemenuComponent,
    ],

  schemas: [],

    imports: [
        CommonModule,
        TranslateModule,
        TranslationModule,
        ButtonModule,
        PanelMenuModule,
        SidebarModule,
        ToastModule,
        MenubarModule,
        MegaMenuModule,
        MenuModule,
        ReactiveFormsModule,
        DialogModule,
        TableModule,
        NgbModule,
        RippleModule,
        ConfirmDialogModule,
        InputTextModule,
        MultiSelectModule,
        CalendarModule,
        DropdownModule,
        ProgressBarModule
    ],

  providers:[
    MessageService,
    ConfirmationService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqInterceptor,
      multi: true,
    },
  ],

    exports: [
        HeaderComponent,
        FooterComponent,
        ButtonComponent,
        PortalTableComponent,
        ConfirmDialogModule,
        PortalDialogComponent,
        ButtonComponent,
        PortalTableComponent,
        GeoportalComponent,
        GisOverviewComponent,
        NavBarNavigationComponent,
        SidemenuComponent
    ],
})
export class CoreModule {
}
