import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private http: HttpClient, private router: Router) {}

  private readonly API_URL = 'http://ec2-65-2-125-202.ap-south-1.compute.amazonaws.com:3000';

  status(): Observable<any> {
    return this.http.get(`${this.API_URL}/status`);
  }

  graph(): Observable<any> {
    return this.http.get(`${this.API_URL}/time`);
  }
}
