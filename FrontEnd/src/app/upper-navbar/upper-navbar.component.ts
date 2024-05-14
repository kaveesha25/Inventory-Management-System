import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

interface User {
  UserName: string;
  FirstName: string;
  LastName: string;
  UserMobile: number;
  Position: string;
  Password: string;
}

@Component({
  selector: 'app-upper-navbar',
  templateUrl: './upper-navbar.component.html',
  styleUrls: ['./sb-admin-2.min.css']
})
export class UpperNavbarComponent implements OnInit {
  user: User | null = null;
  UserName: String = ""

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.UserName = localStorage.getItem('longUsrName') || ''; 
  }
  

  // private fetchUser() {
  //   // Fetch the user data from the server based on the token
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     this.http.get<User>('http://localhost:3000/user', { headers: { Authorization: token } })
  //       .subscribe(
  //         (response) => {
  //           this.user = response;
  //           console.log(this.user)
  //         },
  //         (error) => {
  //           console.error('Error fetching user data:', error);
  //         }
  //       );
  //   }
  // }

  // getUserFullName(): string {
  //   const userData = localStorage.getItem('userData');
  //   console.log(userData)
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     return `${user.FirstName} ${user.LastName}`;
  //   }
  //   return '';
  // }
}
