import { InjectionToken } from "@angular/core";
import { AppConfig } from "./appconfig.interface";
import {environment} from '../../environments/environment';
export const APP_SERVICE_CONFIG = new InjectionToken<AppConfig>('app.config');

export const App_CONFIG: AppConfig = {
    apiEndpoint: environment.apiendpoint
}