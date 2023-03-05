import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleUserComponent } from './users/single/single-user.component';
import { UsersGlobalComponent } from './users/global/users-global.component';
import { UsersSenegalComponent } from './users/senegal/users-senegal.component';

const routes: Routes = [
  {
    path: 'users',
    children: [
      { path: 'senegal', component: UsersSenegalComponent },
      { path: '', component: UsersGlobalComponent },
      { path: ':login', component: SingleUserComponent }
    ]
  },
  {
    path: '**',
    redirectTo: '/users/senegal'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
