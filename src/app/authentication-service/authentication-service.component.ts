import { Component, Input, OnInit } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { AuditCreateComponent } from '../audits/audit-create/audit-create.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Branch } from '../interfaces/Branch';
import { Position } from '../interfaces/Position';
import { DataService } from '../dataService';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-authentication-service',
  standalone: true,
  imports: [FormsModule, NgSelectModule, CommonModule ,MatSelectModule,
    MatFormFieldModule],
  templateUrl: './authentication-service.component.html',
  styleUrl: './authentication-service.component.css'
})

export class AuthenticationServiceComponent implements OnInit{
  @Input()

  confirmPassword: string ='';
  branches: Branch[] = [];
  positions: Position[] = [];
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=[^!@#$%^&*()_+]*[!@#$%^&*()_+]).{8,}$/;
  validation : boolean = true;
  FieldTouched: boolean = false;
  private destroy$ = new Subject<void>();

  user=  {
    email:null,
    // password1:null,
    password:'',
    fullName: null,
    positionId:null,
    branchId: null
  }

  constructor(private dataService: DataService, private router: Router) {
  }

  touchedField(){
    this.FieldTouched = true;
  }
  onPasswordChange(): boolean{
    return this.confirmPassword === this.user.password
  }
  isPasswordStrong(): boolean {
    return this.StrongPasswordRegx.test(this.user.password);
  }
  // onPasswordBlur(){
  //   console.log(this.user.password);
  // }
  ngOnInit(): void {
    this.dataService.getBranches().pipe(takeUntil(this.destroy$)).subscribe(data=> this.branches = data);
    this.dataService.getPosition().pipe(takeUntil(this.destroy$)).subscribe(data=> this.positions = data);
  }
  ngOnDestroy() {
    // console.log('Auth destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    if(Object.values(this.user).every(value => value !== null && value !== '')){
      this.validation = true;
      this.dataService.authenticationService(this.user).pipe(takeUntil(this.destroy$)).subscribe();
      console.log("Destroy")
      this.router.navigate(['/login']);
      this.dataService.logout();
    }
    this.validation = false;
  }
}
