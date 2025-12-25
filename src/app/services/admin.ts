// services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Admin {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get dashboard statistics
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
  }
}