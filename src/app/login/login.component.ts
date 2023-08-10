import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ControlService } from '../home/control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword: boolean = true;
  loginForm: FormGroup; // FormGroup for the entire login form
  email = this.fb.control('', [Validators.required, Validators.email]);
  password = this.fb.control('', [Validators.required]);

  constructor(private fb: FormBuilder, private ControlService: ControlService, private router: Router) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is <strong>required</strong>';
    }
    return this.password.hasError('minlength')
      ? 'Password should be at least 8 characters long'
      : '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const loginData = {
        Username: formData.email,
        Password: formData.password
      };

      this.ControlService.login(loginData).subscribe(
        (response) => {
          const token = response.token;
          this.ControlService.setToken(token);
          this.router.navigate(['/d']);
          console.log("Login SuccessFul!")
        }, 
        (error) => {
          console.log("Login Failed")
        });
    }
  }
  
}

