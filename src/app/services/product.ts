import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Product {
    private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}
 private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // token localStorage me store hota hai
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getProducts(): Observable<any> {
  return this.http.get(`${this.apiUrl}/all`, {
    headers: this.getAuthHeaders()
  });
}


  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

   createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{
    headers: this.getAuthHeaders()

    });

  }
}
