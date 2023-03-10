import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserContributions } from './models/user';
import { GithubService } from './services/github.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private abonnements: Subscription[] = [];
  public currentTab = 0;
  public isLoading = true;
  public displayedColumns: string[] = ['avatarUrl', 'login', 'name', 'commits'];
  public allSenegaleseData: UserContributions[] = [];
  public dataSource = new MatTableDataSource<UserContributions>([]);
  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.obtenirContributionsSenegal();
    this.githubService.retourListeUsers$.subscribe((result: any) => {
      this.isLoading = false;
      if (result) {
        this.allSenegaleseData = result.users;

        this.dataSource.data = this.allSenegaleseData.sort(
          (a: UserContributions, b: UserContributions) =>
            b.contributionsCollection.totalCommitContributions - a.contributionsCollection.totalCommitContributions
        );
      }
    });
  }

  public changeTab(e: MatTabChangeEvent) {
    this.isLoading = true;
    switch (this.currentTab) {
      case 0:
        this.dataSource.data = this.allSenegaleseData.sort(
          (a: UserContributions, b: UserContributions) =>
            b.contributionsCollection.totalCommitContributions - a.contributionsCollection.totalCommitContributions
        );
        this.displayedColumns = ['avatarUrl', 'login', 'name', 'commits'];
        break;
      case 1:
        this.dataSource.data = this.allSenegaleseData.sort(
          (a: UserContributions, b: UserContributions) =>
            b.contributionsCollection.contributionCalendar.totalContributions -
            a.contributionsCollection.contributionCalendar.totalContributions
        );
        this.displayedColumns = ['avatarUrl', 'login', 'name', 'contributions'];
        break;
      case 2:
        this.dataSource.data = this.allSenegaleseData.sort(
          (a: UserContributions, b: UserContributions) =>
            b.contributionsCollection.totalCommitContributions +
            b.contributionsCollection.contributionCalendar.totalContributions -
            (a.contributionsCollection.totalCommitContributions +
              a.contributionsCollection.contributionCalendar.totalContributions)
        );
        this.displayedColumns = ['avatarUrl', 'login', 'name', 'totalContributions'];
        break;
    }
    this.isLoading = false;
  }
  ngOnDestroy(): void {
    this.abonnements.forEach((abo) => {
      abo.unsubscribe();
    });
  }
}
