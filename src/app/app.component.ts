import { Component, HostListener, Injectable, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuditsComponent } from './audits/audits.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DiscripencyComponent } from './discripency/discripency.component';
import { DataService } from './dataService';
import { AuthInterceptor } from './authService';
// import { SubscriptionService } from './SubscriptionService';
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [ CommonModule, RouterOutlet,
  AuditsComponent ,DiscripencyComponent, HttpClientModule, RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'fe';
  // login:boolean = false;
  constructor(private router: Router,  private dataSerice: DataService) {}

  isRouteAudit(): boolean
  {
    return this.router.url.includes('/audit');
  }

  isRouteViolation(): boolean {
    return this.router.url.includes('/violation');
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.dataSerice.checkTokenExpiration();
    // console.log("Hello");
  }
  isLoggedIn(): boolean {
    return this.dataSerice.loginChecked; //crutch, shit
  }

  login(): void {
    // Logic to handle login
    this.router.navigate(['/login']);
    // this.subService.ngOnDestroy();
  }

  logout(): void {
    // this.subService.ngOnDestroy();
    this.dataSerice.logout();
  }


}
