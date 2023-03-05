import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-users-global',
  templateUrl: './users-global.component.html',
  styleUrls: ['./users-global.component.css']
})
export class UsersGlobalComponent implements OnInit {
  public locations: string[] = [];
  public languages: string[] = [];
  public dataSource = new MatTableDataSource<User>([]);
  public showSpinner = false;
  public displayedColumns = ['avatarUrl', 'login', 'name'];
  public disableForm = false;

  public query: Map<string, string[]> = new Map<string, string[]>();
  public form = new FormGroup({
    user: new FormControl(''),
    location: new FormControl(''),
    language: new FormControl('')
  });
  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.form.get('user')?.valueChanges.subscribe((selectedValue) => {
      this.disableForm = selectedValue ? true : false;
      // if(selectedValue){
      //   // this.disableForm=true;
      //    // this.form.get('language')?.disable();
      //   // this.form.get('location')?.disable();
      // }else{
      //   // this.form.get('language')?.enable();
      //   // this.form.get('location')?.enable();
      //   this.disableForm
      // }
    });
    this.githubService.retourListeSearch$.subscribe((result) => {
      this.showSpinner = false;
      if (result) {
        this.dataSource.data = result;
      }
    });
  }

  public addLocation() {
    if (this.form.get('location')!.value!.trim()) {
      this.locations.push(this.form.get('location')!.value!);
      this.form.get('location')!.setValue('');
    }
  }
  public addLanguage() {
    if (this.form.get('language')!.value!.trim()) {
      this.languages.push(this.form.get('language')!.value!);
      this.form.get('language')!.setValue('');
    }
  }

  public removeLocation(ev: string, index: number) {
    this.locations.splice(index, 1);
  }
  public removeLanguage(ev: string, index: number) {
    this.languages.splice(index, 1);
  }

  public submit() {
    if (this.locations.length > 0) {
      this.query.set('location', this.locations);
    }
    if (this.languages.length > 0) {
      this.query.set('language', this.languages);
    }
    const user = this.form.get('user')?.value;
    if (user) {
      this.query.set('user', [user]);
      this.query.delete('location');
      this.query.delete('language');
    }

    this.githubService.filtrer(this.query);
    this.showSpinner = true;
  }
  public reinitialiser() {
    this.query.set('user', []);
    this.query.set('location', []);
    this.query.set('language', []);
    this.form.reset();
    this.languages = [];
    this.locations = [];
  }
}
