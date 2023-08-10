import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AuthGuard } from './home/auth.guard';
import { UnauthGuard } from './home/unauth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'd', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
