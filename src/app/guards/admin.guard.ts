import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}
canActivate(): boolean {

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // user not found → redirect
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(userStr);
      if (user && user.role === 'admin') {
        return true; // ✅ admin allowed
      } else {
        // this.router.navigate(['/cart']); // non-admin
        return false;
      }
    } catch (err) {
      console.error('Error parsing user from localStorage', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/cart']);
      return false;
    }
  }
}
