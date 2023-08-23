import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ControlService {

  private token!: string;

  constructor(private http: HttpClient, private router: Router) {}

  //private readonly API_URL = 'http://localhost:3000';
  private readonly API_URL = 'http://13.127.239.199:3000';

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginData);
  }

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token); // Store the token in the session storage
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('token'); // Retrieve the token from the session storage
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  status(): Observable<any> {
    return this.http.get(`${this.API_URL}/status`);
  }

  graph(): Observable<any> {
    return this.http.get(`${this.API_URL}/graph`);
  }

  lastStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/OnOffStatus`);
  }

  schedule(): Observable<any> {
    return this.http.get(`${this.API_URL}/schedule`);
  }

  addSchedule(scheduleData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/add-schedule`, scheduleData);
  }

  editSchedule(id:string, scheduleData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/edit-schedule/${id}`, scheduleData);
  }

  deleteSchedule(id:string){
    return this.http.delete(`${this.API_URL}/delete-schedule/${id}`);
  }

  logout(): void {
    sessionStorage.removeItem('token'); // Clear the token 
    this.isLoggedIn();
    this.router.navigate(['/login']);
  }
}
