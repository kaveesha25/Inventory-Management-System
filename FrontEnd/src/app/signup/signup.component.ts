import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './sb-admin-2.min.css']
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  phoneNumber: string = '';
  position: string = 'Manager';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup(): void {
    console.log("fddfgs")
    this.http
      .post<any>('http://localhost:3000/sign', {
        UserName: this.username,
        FirstName: this.firstName,
        LastName: this.lastName,
        UserMobile: this.phoneNumber,
        Position: this.position,
        Password: this.password,
      })
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('longUsrName', this.username); 
          this.router.navigate(['/purchases']);
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );
  }

}
