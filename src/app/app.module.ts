import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GithubService } from './services/github.service';
import { UsersTableComponent } from './users/table/users-table.component';
import { UsersSenegalComponent } from './users/senegal/users-senegal.component';
import { UsersGlobalComponent } from './users/global/users-global.component';
import { SingleUserComponent } from './users/single/single-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from './shared/tag/tag.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { CustomDialogComponent } from './shared/custom-dialog/custom-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersTableComponent,
    UsersSenegalComponent,
    UsersGlobalComponent,
    SingleUserComponent,
    TagComponent,
    SanitizeHtmlPipe,
    CustomDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    LazyLoadImageModule
  ],
  providers: [GithubService],
  bootstrap: [AppComponent]
})
export class AppModule {}
