import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { TechnoData } from 'src/app/models/technos';
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
  public userTechnosData: any;
  doughChartProps: any;
  barChartProps: any;
  public dataSource = new MatTableDataSource<UserContributions>([]);
  constructor(private githubService: GithubService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.githubService.getHealthCheck(); // prevent cold start in backend
    this.githubService.obtenirContributionsSenegal();
    this.githubService.getTechnos();
    this.suscriptions.push(
      this.githubService.retourListeUsers$.subscribe((result: any) => {
        document.getElementById('content')!.scrollIntoView(true);
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
    this.suscriptions.push(
      this.githubService.retourTechnoData$.subscribe((data: TechnoData) => {
        this.isLoading = false;
        this.userTechnosData = data;
        this.doughChartProps = this.getCircleChartOptions(
          Object.keys(data.technos_repartition),
          Object.values(data.technos_repartition),
          'Repartition des Technologies'
        );
        this.barChartProps = this.getBarChartOptions(
          Object.keys(data.technos_types),
          Object.values(data.technos_types),
          'Repartition des Technologies'
        );
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
  getBarChartOptions(labels: string[], data: number[], label: string = 'Value'): any {
    return {
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: false }
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    };
  }

  getCircleChartOptions(labels: string[], data: number[], label: string = 'Value'): any {
    return {
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: this.generateColors(data.length)
          }
        ]
      },
      options: {
        // responsive: true,

        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: { display: false }
        }
      }
    };
  }
  generateColors(length: number) {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
  }
}
