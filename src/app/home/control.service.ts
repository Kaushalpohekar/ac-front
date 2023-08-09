import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private http: HttpClient, private router: Router) {}

  private readonly API_URL = 'http://localhost:3000';

  status(): Observable<any> {
    return this.http.get(`${this.API_URL}/status`);
  }
}
