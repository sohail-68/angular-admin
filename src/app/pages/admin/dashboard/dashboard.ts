// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../services/order'; // ✅ Service name correct

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  orders: any[] = [];
  loading: boolean = false;
  error: string = '';

  // Statistics
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  };

  toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
  constructor(private order: Order) {} // ✅ Constructor parameter name correct

  ngOnInit(): void {
    this.loadOrders();

  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.order.getAllOrders().subscribe({ // ✅ Service name correct
      next: (data: any) => {
        this.orders = data;
  console.log(this.orders);
        
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter(order => 
      order.status === 'Pending' || order.status === 'Processing'
    ).length;
    this.stats.completedOrders = this.orders.filter(order => 
      order.status === 'Delivered'
    ).length;
    this.stats.totalRevenue = this.orders.reduce((sum, order) => 
      sum + (order.totalPrice || 0), 0
    );
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.order.updateOrderStatus(orderId, newStatus).subscribe({ // ✅ Service name correct
      next: (updatedOrder: any) => {
        // Update local orders array
        const index = this.orders.findIndex(order => order._id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.calculateStats();
        }
        alert('Order status updated successfully!');
      },
      error: (err: any) => {
        alert(err.error?.message || 'Failed to update order status');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString('en-IN');
  }
}