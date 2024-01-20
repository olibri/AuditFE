import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() {}
  jwtHelper = new JwtHelperService();
  decodeToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  getTokenExpirationDate(token: string) {
    return this.jwtHelper.getTokenExpirationDate(token);
  }

  isTokenExpired(token: string) {
    return this.jwtHelper.isTokenExpired(token);
  }
}
