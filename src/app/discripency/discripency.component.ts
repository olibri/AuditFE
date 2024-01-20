import { Discrepancies } from '../interfaces/Discrepancies';
import { Component , Injectable, OnInit, TemplateRef, inject} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '../dataService';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscrepancyService } from '../interfaces/DiscrepancyService';
import { Subject, filter, map, takeUntil } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-discripency',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgbDatepickerModule],
  templateUrl: './discripency.component.html',
  styleUrl: './discripency.component.css',

})
export class DiscripencyComponent implements OnInit  {
  data: Discrepancies[]= [];
  route: ActivatedRoute = inject(ActivatedRoute);
  public id: number = -1;
  public auditIdnumber :number= 0;
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService,  private auditId: DiscrepancyService, private router: Router,private activatedRoute: ActivatedRoute){
    this.id = Number(this.route.snapshot.params['id']);
    this.auditId.setId(this.id);
    this.auditIdnumber = this.auditId.getId();

    // console.log(this.auditId.getId(), this.id);
    this.router.events.pipe(takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ngOnInit()
    });
  }
  ngOnInit() {
    this.dataService.getDiscrepancyById(this.id)
    .pipe(takeUntil(this.destroy$),
      map(discripencies => discripencies.reverse())
    ).subscribe(discripencies => this.data = discripencies);
  }

  ngOnDestroy() {
    // console.log('Destroy Descripency');
    this.destroy$.next();
    this.destroy$.complete();
  }
  getIso(iso:any[]):string {
    return iso.map(i=> i.isoDirectory.isoName).join(', ');
  }

  private modalService = inject(NgbModal);
	closeResult = '';

  open(content: TemplateRef<any>, id:number) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.id = id;
	}
  onSubmit() {
    this.dataService.deleteDescripency(this.id).subscribe(/* обробка відповіді */);
    this.closeResult = 'Deleted';
    this.reloadComponent(true, `discripency/${this.id}`);
  }
  reloadComponent(self:boolean,urlToNavigateTo ?:string){
    // console.log("Current route I am on:",this.router.url);
    const url=self ? this.router.url :urlToNavigateTo;
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate([`/${url}`]).then(()=>{
        // console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }
}
