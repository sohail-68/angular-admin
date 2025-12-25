import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule,RouterModule],
  styleUrls: ['./login.css']
})
export class Login {   // class name proper rakho
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        console.log('Login success', res);
        localStorage.setItem('token', res.token); // store JWT
        localStorage.setItem('user', JSON.stringify(res)); // store user info

        // role-based navigation
        if(res.role === 'admin') {
          console.log(res.role);
          
          this.router.navigate(['/admin/dashorders']);
        } else {
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}
