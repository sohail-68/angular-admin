import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports:[FormsModule,RouterModule],

  
})
export class Register {
  name = '';
  email = '';
  password = '';
  role = 'admin';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
      next: (res) => {
        console.log('Registration success', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/login']); // redirect after registration
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert(err.error.message || 'Registration failed');
      }
    });
  }
}
