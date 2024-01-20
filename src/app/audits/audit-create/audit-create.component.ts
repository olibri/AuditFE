import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from '../../dataService';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from '../../interfaces/Branch';
import { User } from '../../interfaces/User';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-audit-create',
  standalone: true,
  imports: [FormsModule, NgSelectModule, CommonModule ,MatSelectModule,
    MatFormFieldModule],
  templateUrl: './audit-create.component.html',
  styleUrl: './audit-create.component.css'
})
export class AuditCreateComponent implements OnInit, OnDestroy  {
  @Input()
  minlength: string| number| undefined

  branches: Branch[] = [];
  users: User[] = [];
  selectedCars =[];
  private destroy$ = new Subject<void>();

  auditData= {
    timeOfCreating: '',
    typeOfAudit: null,
    goalOfAudit: '',
    branchId: null,
    auditUser: [] as { userId: number }[],
  };
  constructor(private dataService: DataService, private route: ActivatedRoute,private router: Router) {}
  ngOnInit(): void {
    this.dataService.getBranches().pipe(takeUntil(this.destroy$)).subscribe(data => this.branches = data);
    this.dataService.getUsers().pipe(takeUntil(this.destroy$)).subscribe(data => this.users = data);
  }
  ngOnDestroy() {
    // console.log('Audit-create destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit() {
    const a = this.selectedCars.map(id => ({ userId: id }));
    this.auditData.auditUser = [...this.auditData.auditUser, ...a];
    this.dataService.createAudit(this.auditData).pipe(takeUntil(this.destroy$)).subscribe( );
    this.router.navigate(['/audit']);
  }

  preventDoubleSpace(event: any): void {
    const inputElement: HTMLInputElement = event.target;
    inputElement.value = inputElement.value.replace(/\s\s+/g, ' ');
  }
  updateWordCount(): void{
    const myText = (document.getElementById('myText') as HTMLTextAreaElement).value;
    this.minlength = myText.length;
  }
}
