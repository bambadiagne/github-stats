import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { UserContributions } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-users-senegal',
  templateUrl: './users-senegal.component.html',
  styleUrls: ['./users-senegal.component.css']
})
export class UsersSenegalComponent implements OnInit, OnDestroy {
  private suscriptions: Subscription[] = [];
  public currentTab = 0;
  public isLoading = true;
  public displayedColumns: string[] = ['avatarUrl', 'login', 'name', 'commits'];
  public allSenegaleseData: UserContributions[] = [];
  public dataSource = new MatTableDataSource<UserContributions>([]);
  constructor(private githubService: GithubService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.githubService.appelerHealthCheck(); // prevent cold start in backend
    this.githubService.obtenirContributionsSenegal();
    this.suscriptions.push(
      this.githubService.retourListeUsers$.subscribe((result: any) => {
        document.getElementById('content')!.scrollIntoView(true);
        this.isLoading = false;
        if (result) {
          this.allSenegaleseData = result.users;

          this.dataSource.data = this.allSenegaleseData.sort(
            (a: UserContributions, b: UserContributions) =>
              b.contributionsCollection.totalCommitContributions - a.contributionsCollection.totalCommitContributions
          );
        }
      })
    );
    this.suscriptions.push(
      this.githubService.messageErreur$.subscribe((erreur) => {
        this.isLoading = false;
        Utils.openAlertDialog(this.dialog, erreur);
      })
    );
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
            b.contributionsCollection.restrictedContributionsCount -
            (a.contributionsCollection.contributionCalendar.totalContributions -
              a.contributionsCollection.restrictedContributionsCount)
        );
        this.displayedColumns = ['avatarUrl', 'login', 'name', 'contributions'];
        break;
      case 2:
        this.dataSource.data = this.allSenegaleseData.sort(
          (a: UserContributions, b: UserContributions) =>
            b.contributionsCollection.contributionCalendar.totalContributions -
            a.contributionsCollection.contributionCalendar.totalContributions
        );
        this.displayedColumns = ['avatarUrl', 'login', 'name', 'totalContributions'];
        break;
    }
    this.isLoading = false;
  }
  ngOnDestroy(): void {
    this.suscriptions.forEach((abo) => {
      abo.unsubscribe();
    });
  }
}
