import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Audit } from './interfaces/Audit';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Discrepancies } from './interfaces/Discrepancies';
import { Branch } from './interfaces/Branch';
import { User } from './interfaces/User';
import { Iso } from './interfaces/Iso';
import { Status } from './interfaces/Status';
import { Position } from './interfaces/Position';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService
{
  // private url = "http://localhost:5017";
  private url = "https://localhost:51276";

  public loginChecked :boolean = false;
  private jwtService: JwtHelperService = new JwtHelperService();
  private constructor(private http: HttpClient, private router: Router) {}

  getAudits(): Observable<Audit[]> {
      // console.log('TEST');
      return this.http.get<{ $id: string, $values: Audit[] }>(`${this.url}/Audit`,{
        headers:new HttpHeaders ({
          'Authorization': `Bearer ${this.getToken()}`
        })
      }).pipe(map(response => response.$values));
  }

  getDiscrepancyById(id: number): Observable<Discrepancies[]>
  {
    return this.http.get<{ $id: string, $values: Discrepancies[] }>(`${this.url}/api/Discrepancy`,
    {
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).pipe(map(response => response.$values.filter(discrepancy => discrepancy.auditId === id)));
  }

  updateAudit(audit: any, id:number): Observable<any> {
    return this.http.put(`${this.url}/Audit/${id}`, audit,{
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }
  updateDiscripency(discripency: any, id:number): Observable<any> {
    return this.http.put(`${this.url}/api/Discrepancy/${id}`, discripency,{
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }

  createAudit(audit: any): Observable<any> {
    return this.http.post(`${this.url}/Audit/`, audit, {
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }
  createDiscripency(discripency: any): Observable<any> {
    return this.http.post(`${this.url}/api/Discrepancy/`, discripency, {
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    });
  }
  deleteAudit(id:number): Observable<any> {
    return this.http.delete(`${this.url}/Audit/${id}`,{
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    })
  }
  deleteDescripency(id:number): Observable<any> {
    return this.http.delete(`${this.url}/api/Discrepancy/${id}`, {
      headers:new HttpHeaders ({
        'Authorization': `Bearer ${this.getToken()}`
      })
    })
  }
  authenticationService(user:any): Observable<any> {
    return this.http.post(`${this.url}/api/Account/Register`, user);
  }
  loginService(user:any): Observable<any>{
    return this.http.post<any>(`${this.url}/api/Account/Login`, user).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['audit']);
          this.loginChecked = true;
        }
        else {
          console.log('No token in the response');
        }
        return response;
      })
    );
  }

  getRole():string{
    const token = this.getToken();
    const decode = this.jwtService.decodeToken(token);
    return decode.role;
  }
  getToken(): any {
    return localStorage.getItem('token');
  }
  logout():any{

    this.router.navigate(['login']);
    // this.http.post<any>(`${this.url}/api/Account/Logout`,{})
    // this.loginChecked = false;
    localStorage.removeItem('token');
  }
  checkTokenExpiration(){
    const token = this.getToken();
    if (token) {
      const isExpired = this.jwtService.isTokenExpired(token);
      if (isExpired) {
        this.logout();
        console.log('Token has expired and has been cleared');
      }
    }
  }
  getBranches(): Observable<Branch[]> {
    return this.http.get<{$id: string, $values: Branch[]}>(`${this.url}/api/Branch`).pipe(map(response => response.$values));
  }
  getPosition(): Observable<Position[]> {
    return this.http.get<{$id: string, $values: Position[]}>(`${this.url}/api/Position`).pipe(map(response => response.$values));
  }
  getIso(): Observable<Iso[]> {
    return this.http.get<{$id: string, $values: Iso[]}>(`${this.url}/api/Iso`).pipe(map(response => response.$values));
  }
  getStatus(): Observable<Status[]> {
    return this.http.get<{$id: string, $values: Status[]}>(`${this.url}/api/Status`).pipe(map(response => response.$values));
  }
  getUsers(): Observable<User[]> {
    return this.http.get<{$id: string, $values: User[]}>(`${this.url}/api/User`).pipe(map(response => response.$values));
  }

}
