import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GithubService } from './services/github.service';
import { UsersTableComponent } from './users/users-table/users-table.component';
import { UsersSenegalComponent } from './users/users-senegal/users-senegal.component';
import { UsersGlobalComponent } from './users/users-global/users-global.component';
import { SingleUserComponent } from './users/single-user/single-user.component';

@NgModule({
  declarations: [AppComponent, UsersTableComponent, UsersSenegalComponent, UsersGlobalComponent, SingleUserComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule, NgbModule, HttpClientModule],
  providers: [GithubService],
  bootstrap: [AppComponent]
})
export class AppModule {}
