import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../../api/api.config';
import { BaseResponse } from '../types/baseresponse.type';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    baseUrl: string = API_CONFIG.BASE_URL;

    constructor(private http: HttpClient) { }

    getSensorData(params?: { [key: string]: string | number }): Observable<BaseResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                httpParams = httpParams.set(key, params[key].toString());
            });
        }

        return this.http.get<BaseResponse>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SENSOR_LIST}`, { params: httpParams });
    }

    getHistoryData(params?: { [key: string]: string | number }): Observable<BaseResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                httpParams = httpParams.set(key, params[key].toString());
            });
        }

        return this.http.get<BaseResponse>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HISTORY_LIST}`, { params: httpParams });
    }

    getDeviceData() {
        // return this.deviceDataSubject.asObservable();
    }
}
