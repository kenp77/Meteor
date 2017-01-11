import { Component } from '@angular/core';

import style from './app.component.scss';
import template from './app.component.web.html';
import {InjectUser} from "angular2-meteor-accounts-ui";

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app',
  template,
  //styleUrls: ['../main.scss']
  /*styles: [ style ]*/
  //styleUrls: ['../../node_modules/@angular/material/core/theming/alsl-theme'],
})
@InjectUser('user')
export class AppComponent {
  constructor(private localStorageService: LocalStorageService) {
  }

  private isDarkTheme = false;

  private _toggleTheme: boolean;

  private _themeColor: string;

  public get globalTheme (): boolean {
      if (this.localStorageService.get('themeValue') == "dark") {
          this._toggleTheme = false;
      }
      else {
          this._toggleTheme = true;
      }
      this.changeTheme(this._toggleTheme);

      return this._toggleTheme;
  }

  public set globalTheme (newValue) {
      this._themeColor = newValue == true ? "white" : "dark" ;
      this.localStorageService.set('themeValue', this._themeColor);
  }

  changeTheme(value){
    if(value == true){
      document.body.style.backgroundColor = "#f8f8f8";
      this.isDarkTheme = false;
      this.localStorageService.set('themeValue', "white");
    }
    else{
      document.body.style.backgroundColor = "#424242";
      this.isDarkTheme = true;
      this.localStorageService.set('themeValue', "dark");
    }
  }

  logout() {
    Meteor.logout();
  }
}
