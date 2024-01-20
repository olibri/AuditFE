import { DiscrepancyService } from './../../interfaces/DiscrepancyService';
import { DiscripencyComponent } from './../discripency.component';
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { Branch } from '../../interfaces/Branch';
import { User } from '../../interfaces/User';
import { DataService } from '../../dataService';
import { ActivatedRoute, Router } from '@angular/router';
import { Discrepancies } from '../../interfaces/Discrepancies';
import { Iso } from '../../interfaces/Iso';
import { Status } from '../../interfaces/Status';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-discripency-edit',
  standalone: true,
  imports: [FormsModule, NgSelectModule, CommonModule ,MatSelectModule,
    MatFormFieldModule, DiscripencyComponent],
  templateUrl: './discripency-edit.component.html',
  styleUrl: './discripency-edit.component.css'
})
export class DiscripencyEditComponent implements OnInit, OnDestroy{
  id:number = 0;
  iso: Iso[] = [];
  status: Status[] = [];
  selectedIso =[];
  AuditId: number = 0;
  private destroy$ = new Subject<void>();

  discrepanciesData={
    isoDiscrepancy: [] as {isoDirectoryId:number}[],
    discrepancyType: null,
    anotherDiscrepancyRequirements: '',
    descriptionOfDiscrepancy: '',
    dateOfDetection:'',
    reasonOfDiscrepancy: '',
    dateOfContorolNoticed: '',
    auditId: 0,
    statusId: null
  };
  constructor(private auditId: DiscrepancyService,private router: Router, private dataService: DataService, private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.params['id']);
    this.AuditId = auditId.getId();
  }
  ngOnInit(): void {
    this.dataService.getIso().pipe(takeUntil(this.destroy$)).subscribe(data=> this.iso = data);
    this.dataService.getStatus().pipe(takeUntil(this.destroy$)).subscribe(data=> this.status = data);
  }

  ngOnDestroy() {
    // console.log('Discrepancy-edit destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    const a = this.selectedIso.map(id => ({ isoDirectoryId: id }));
    this.discrepanciesData.isoDiscrepancy = [...this.discrepanciesData.isoDiscrepancy, ...a];
    this.discrepanciesData.auditId = this.AuditId;

    this.dataService.updateDiscripency(this.discrepanciesData, this.id).subscribe(/* обробка відповіді */);
    this.router.navigate(['discripency/', this.discrepanciesData.auditId]);

  }
}
