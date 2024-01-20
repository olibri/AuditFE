import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from './../dataService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JwtService } from '../jwtService';
import { JwtModule } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login-service',
  standalone: true,
  imports: [FormsModule, JwtModule, CommonModule],
  templateUrl: './login-service.component.html',
  styleUrl: './login-service.component.css'
})
export class LoginServiceComponent {
  userLogin={
    email: '',
    password:''
  }
  token: string = '';
  decodedToken: any;
  expirationDate: Date | null  = null;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private dataSerice: DataService ,private router: Router , private jwtService: JwtService){ }
  ngOnDestroy() {
    // console.log('Audits destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    this.dataSerice.loginService(this.userLogin).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.token = this.dataSerice.getToken();
        this.decodedToken = this.jwtService.decodeToken(this.token);
        this.expirationDate = this.jwtService.getTokenExpirationDate(this.token);
      },
      error: error => {
        this.ngOnDestroy();
        this.dataSerice.logout();
        this.errorMessage = "Wrong Email or Password";
      }
    });
  }

  // checkToken(){
  //   const isExpired = this.jwtService.isTokenExpired(this.token);
  //   if (isExpired) {
  //     this.dataSerice.logout();
  //     console.log('Token has expired and has been cleared');
  //   }
  // }
}
