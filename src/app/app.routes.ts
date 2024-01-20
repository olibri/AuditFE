import { RouterModule, Routes } from '@angular/router';
import { DiscripencyComponent } from './discripency/discripency.component';
import { AuditsComponent } from './audits/audits.component';
import { AuditEditComponent } from './audits/audit-edit/audit-edit.component';
import { AuditCreateComponent } from './audits/audit-create/audit-create.component';
import { DiscripencyEditComponent } from './discripency/discripency-edit/discripency-edit.component';
import { DiscripencyCreateComponent } from './discripency/discripency-create/discripency-create.component';
import { ViolationComponent } from './violation/violation.component';
import { AuthenticationServiceComponent } from './authentication-service/authentication-service.component';
import { LoginServiceComponent } from './login-service/login-service.component';
import { adminOnlyGuard } from './RoleService';

export const routes: Routes = [
  // {path: '', component: LoginServiceComponent},
  {path: 'audit', component: AuditsComponent},
  {path: 'discripency/:id', component: DiscripencyComponent },
  {path: 'audit/edit/:id', component: AuditEditComponent, canActivate: [adminOnlyGuard]},
  {path: 'audit/create', component: AuditCreateComponent, canActivate: [adminOnlyGuard]},
  {path: 'descripency/:id/edit/:id', component: DiscripencyEditComponent, canActivate: [adminOnlyGuard]},
  {path: 'descripency/:id/create', component: DiscripencyCreateComponent, canActivate: [adminOnlyGuard]},
  {path: 'violation', component: ViolationComponent},
  {path: 'sing-in', component: AuthenticationServiceComponent},
  {path: 'login', component: LoginServiceComponent},
  // {path: 'logout', component: LoginServiceComponent}
];


