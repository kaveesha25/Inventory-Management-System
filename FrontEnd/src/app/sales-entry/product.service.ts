// product.service.ts (mock implementation)

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Get product details by ProductID
  getProductDetails(BatchNumber: string): Observable<any> {
    const url = `${this.apiUrl}/product/${BatchNumber}`;
    return this.http.get<any>(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching product details:', error);
        throw error;
      })
    );
  }
}
