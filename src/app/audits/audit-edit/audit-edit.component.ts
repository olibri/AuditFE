import { CommonModule } from '@angular/common';
import { Component,  Input,  OnDestroy,  OnInit, } from '@angular/core';
import { FormBuilder,  FormsModule } from '@angular/forms';
import { DataService } from '../../dataService';
import { User } from '../../interfaces/User';
import { Branch } from '../../interfaces/Branch';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-audit-edit',
  standalone: true,

  imports: [FormsModule, NgSelectModule, CommonModule ,MatSelectModule,
    MatFormFieldModule
],
  templateUrl: './audit-edit.component.html',
  styleUrl: './audit-edit.component.css'
})
export class AuditEditComponent implements OnInit, OnDestroy {
  @Input()
  minlength: string| number| undefined
  id:number = 0;
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

  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.params['id']);
  }


  ngOnInit(): void {
    this.dataService.getBranches().pipe(takeUntil(this.destroy$)).subscribe(data => this.branches = data);
    this.dataService.getUsers().pipe(takeUntil(this.destroy$)).subscribe(data => this.users = data);
  }
  onSubmit() {
    const a = this.selectedCars.map(id => ({ userId: id }));
    this.auditData.auditUser = [...this.auditData.auditUser, ...a];
    this.dataService.updateAudit(this.auditData, this.id).pipe(takeUntil(this.destroy$)).subscribe(/* обробка відповіді */);
    this.router.navigate(['/audit']);
  }
  ngOnDestroy() {
    // console.log('Audit-edit destroyed');
    this.destroy$.next();
    this.destroy$.complete();
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
