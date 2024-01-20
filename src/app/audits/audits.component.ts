import { routes } from './../app.routes';
import { Audit } from './../interfaces/Audit';
import { Component, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';
import { DataService } from '../dataService';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuditEditComponent } from './audit-edit/audit-edit.component';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditCreateComponent } from './audit-create/audit-create.component';
import { Subject, Subscription, filter, map, takeUntil } from 'rxjs';
import { AuthGuardService } from '../RoleService';
// import { SubscriptionService } from '../SubscriptionService';


@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AuditEditComponent, AuditCreateComponent, NgbDatepickerModule],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit   {
  data: Audit[] =[];
  isEditing = false;
  selectedItem: any;
  id:number = 0;
  private routerSubscription: Subscription = new Subscription();
  private subService1: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  private role : AuthGuardService;

  constructor(private dataService: DataService, private router: Router ){
    this.role = new AuthGuardService(dataService, router);
    this.router.events.pipe(takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ngOnInit();
    });
  }
  ngOnDestroy() {
    // console.log('Audits destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ngOnDestroy(): void {
  //   if (this.subService1) {
  //     this.subService1.unsubscribe();
  //     console.log('subService1');
  //     this.dataService.logout();
  //   }

  //   // if (this.routerSubscription) {
  //   //   this.routerSubscription.unsubscribe();
  //   //   console.log('routerSubscription');
  //   // }
  // }
  ngOnInit(): void{
    this.loadData();
  }

  loadData(): void {
    this.subService1=this.dataService.getAudits()
    .pipe(takeUntil(this.destroy$),
      map(audits => audits.reverse())
    ).subscribe(reversedAudits => this.data = reversedAudits);
  }
  getAllEmails(users:any[]):string {
    // console.log(users);
    return users.map(u => u.user.email).join(', ');
  }
  getStatusColor(status: string): string{
    switch (status) {
      case 'Open':
        return 'red';
      case 'Closed':
        return 'green';
      default:
        return 'black';
    }
  }

  private modalService = inject(NgbModal);
	closeResult = '';

	open(content: TemplateRef<any>, id:number) {
    if(this.dataService.getRole() === 'Admin') {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      this.id = id;
    }
	}
  onSubmit() {
    this.dataService.deleteAudit(this.id).subscribe(/* обробка відповіді */);
    this.closeResult = 'Deleted';
    // window.location.reload();
    this.reloadComponent(true, '/audit');
  }
  reloadComponent(self:boolean,urlToNavigateTo ?:string){
  //  console.log("Current route I am on:",this.router.url);
   const url=self ? this.router.url :urlToNavigateTo;
   this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
     this.router.navigate([`/${url}`]).then(()=>{
      //  console.log(`After navigation I am on:${this.router.url}`)
     })
   })
 }

}

