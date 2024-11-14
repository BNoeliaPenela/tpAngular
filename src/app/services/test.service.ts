import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private url =  "https://api.restful-api.dev/objects"

  constructor(private http: HttpClient) { }
  
  getAll(): Observable<any> {
    return this.http.get(this.url)
  }

  addPhone(test: Test): Observable<any> {
    return this.http.post<any>(this.url, test)
  }

  deletePhone(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`)
  }

  updatePhone(test: Test): Observable<any> {
    return this.http.put(`${this.url}/${test.id}`, test)
  }
  
}
