import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { Ng2PaginationModule } from 'ng2-pagination';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from "./app.component.web";
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { PARTIES_DECLARATIONS } from './parties';
import { SHARED_DECLARATIONS } from './shared';
import { MaterialModule } from "@angular/material";
import { AUTH_DECLARATIONS } from "./auth/index";
import { FileDropModule } from "angular2-file-drop";
import { MOBILE_DECLARATIONS } from "./mobile/index";
import { AppMobileComponent } from "./mobile/app.component.mobile";
import { IonicModule, IonicApp } from "ionic-angular";
import { Md2Module } from "md2";
import { PartiesListMobileComponent } from "./mobile/parties-list.component.mobile";
import { PartiesFormComponent } from "./parties/parties-form.component";
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

let moduleDefinition;

let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'localStorage'
};

if (Meteor.isCordova) {
  moduleDefinition = {
    imports: [
      Ng2PaginationModule,
      IonicModule.forRoot(AppMobileComponent)
    ],
    declarations: [
      ...SHARED_DECLARATIONS,
      ...MOBILE_DECLARATIONS
    ],
    providers: [
    ],
    bootstrap: [
      IonicApp
    ],
    entryComponents: [
      PartiesListMobileComponent
    ]
  }
}
else {
  moduleDefinition = {
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forRoot(routes),
      AccountsModule,
      Ng2PaginationModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
      }),
      MaterialModule.forRoot(),
      Md2Module.forRoot(),
      FileDropModule
    ],
    declarations: [
      AppComponent,
      ...PARTIES_DECLARATIONS,
      ...SHARED_DECLARATIONS,
      ...AUTH_DECLARATIONS,
        PartiesFormComponent
    ],
    entryComponents: [
      PartiesFormComponent
    ],
    providers: [
      ...ROUTES_PROVIDERS,
      LocalStorageService,
      {
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
      }
    ],
    bootstrap: [
      AppComponent
    ]
  }
}

@NgModule(moduleDefinition)
export class AppModule {}
