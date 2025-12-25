// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Order {
  private apiUrl = 'https://angular-server-mxyp.onrender.com/api/orders';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all orders (Admin only)
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/adminorders`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update order status (Admin only)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }

  // Get my orders (User)
  getMyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/myorders`, {
      headers: this.getAuthHeaders()
    });
  }
}