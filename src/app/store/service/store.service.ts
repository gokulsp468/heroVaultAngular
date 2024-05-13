import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_SERVICE_CONFIG } from '../../appconfig/appconfig.service';
import { AppConfig } from '../../appconfig/appconfig.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http:HttpClient,@Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }

  getStoreData(
    page?: number,
    pageLimit?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: number,
    fromDate?: string,
    toDate?: string
  ) {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageLimit !== undefined) {
      params = params.set('page_limit', pageLimit.toString());
    }
    if (searchTerm !== undefined) {
      params = params.set('searchTerm', searchTerm);
    }
    if (sortBy !== undefined) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder !== undefined) {
      params = params.set('sortOrder', sortOrder.toString());
    }
    if (fromDate !== undefined) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate !== undefined) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<any>(`${this.config.apiEndpoint}/store/stores/`, { params });
  }


  addStore(categoryData:any){
    return this.http.post<any>(`${this.config.apiEndpoint}/store/stores/`,categoryData)
  }

  editStore(categoryData:any,catId:any){
    return this.http.patch<any>(`${this.config.apiEndpoint}/store/stores/${catId}/`,categoryData)
  }
  deleteStore(catId:any){
    return this.http.delete<any>(`${this.config.apiEndpoint}/store/stores/${catId}/`)
  }
}
