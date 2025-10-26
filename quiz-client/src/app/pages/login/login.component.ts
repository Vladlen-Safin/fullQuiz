import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'quiz-client';
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  moveToRegister() {
    this.router.navigate(['/register']);
  }

  moveToConnectGame() {
    this.router.navigate(['/join-game'])
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
}
