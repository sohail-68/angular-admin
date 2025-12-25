// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Cart } from './pages/cart/cart';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Admin } from './layouts/admin/admin';
import { AdminGuard } from './guards/admin.guard';
import { List } from './pages/products/list/list';
import { Orders } from './pages/orders/orders';
import { Add } from './pages/products/add/add';
export const appRoutes: Routes = [
      {
    path: 'admin',
    component: Admin, // Admin layout
    canActivate:[AdminGuard],
    children: [
      { path: 'orders', component: Dashboard },
      { path: 'Addproducts', component: Add },
      { path: 'products', component: List },
      { path: 'dashorders', component: Orders },
    ]
  },


  // { path: '', redirectTo: '/cart', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //
  { path: 'login', component: Login },
  { path: 'cart', component: Cart },
  { path: 'register', component: Register },

];
