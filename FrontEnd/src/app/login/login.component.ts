import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','./sb-admin-2.min.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  // longUserName : string = '';

  constructor(private http: HttpClient, private router: Router) {
  }
 
  login(): void {
    this.http
      .post<any>('http://localhost:3000/login', {
        UserName: this.username,
        Password: this.password,
      })
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          // console.log(response.userData)
          // localStorage.setItem('userData', JSON.stringify(response.userData));
          localStorage.setItem('longUsrName', this.username); 
          this.router.navigate(['/purchases']);
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );
  }
}
