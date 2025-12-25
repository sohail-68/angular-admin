// components/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  stats: any = {
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0
  };
  loading: boolean = false;
  error: string = '';

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getStats().subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load statistics';
        this.loading = false;
      }
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-IN');
  }

  formatPrice(price: number): string {
    if (isNaN(price)) return '₹0';
    return '₹' + price.toLocaleString('en-IN');
  }
}