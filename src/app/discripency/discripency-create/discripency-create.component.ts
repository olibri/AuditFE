import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { DiscripencyComponent } from '../discripency.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Iso } from '../../interfaces/Iso';
import { Status } from '../../interfaces/Status';
import { DiscrepancyService } from '../../interfaces/DiscrepancyService';
import { DataService } from '../../dataService';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-discripency-create',
  standalone: true,
  imports: [FormsModule, NgSelectModule, CommonModule ,MatSelectModule,
    MatFormFieldModule, DiscripencyComponent],
  templateUrl: './discripency-create.component.html',
  styleUrl: './discripency-create.component.css'
})
export class DiscripencyCreateComponent implements OnInit, OnDestroy {
  id:number = 0;
  iso: Iso[] = [];
  status: Status[] = [];
  selectedIso =[];
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
  constructor(private auditId: DiscrepancyService, private router: Router, private dataService: DataService, private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.dataService.getIso().pipe(takeUntil(this.destroy$)).subscribe(data=> this.iso = data);
    this.dataService.getStatus().pipe(takeUntil(this.destroy$)).subscribe(data=> this.status = data);
  }
  ngOnDestroy() {
    // console.log('Discripency-create destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    const a = this.selectedIso.map(id => ({ isoDirectoryId: id }));
    this.discrepanciesData.isoDiscrepancy = [...this.discrepanciesData.isoDiscrepancy, ...a];
    this.discrepanciesData.auditId = this.id;

    this.dataService.createDiscripency(this.discrepanciesData).subscribe(/* обробка відповіді */);
    this.router.navigate(['discripency/', this.id]);
  }
}
