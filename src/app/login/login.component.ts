import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}

