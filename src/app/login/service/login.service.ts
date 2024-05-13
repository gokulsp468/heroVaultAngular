import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_SERVICE_CONFIG } from '../../appconfig/appconfig.service';
import { AppConfig } from '../../appconfig/appconfig.interface';

@Injectable({
  providedIn: 'root'
})
export class Loginservice {
  constructor(private http: HttpClient,@Inject(APP_SERVICE_CONFIG) private config:AppConfig){}
  isloggedIn:boolean = false;


  login(loginCredentials:any){
    this.isloggedIn = true;
    return this.http.post<any>(`${this.config.apiEndpoint}/auth/api/token/`,loginCredentials)

  }

  loggedIn():boolean{
    return !!localStorage.getItem('loginToken')
  }
}
