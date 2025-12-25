import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../services/product';  // ✅ aapka service file ka naam
import {  } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true, // ✅ agar standalone component hai
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  products: any[] = [];
  loading = false;
  error = '';

  constructor(private productService: Product, private router: Router) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  // 🔹 Fetch all products
getAllProducts(): void {

  this.loading = true;
  this.productService.getProducts().subscribe({
    next: (res: any) => {
      this.products = res.products;  // ✅ products array yahan se lo
      // optional: pagination info
      // this.page = res.page;
      // this.pages = res.pages;
      // this.total = res.total;
      this.loading = false;
console.log(this.products);

    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load products';
      this.loading = false;
    }
  });
}


  // 🔹 Delete product
  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((p: any) => p._id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Delete failed');
      }
    });
  }

  // 🔹 Edit product (navigate to edit page)
 // 🔥 Method 1: Using router.navigate with state
  editProduct(product: any) {
    this.router.navigate(['admin/Addproducts'], {
      state: { product: product }
    });
  }

}
