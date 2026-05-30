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
            backgroundColor: 'rgba(0, 133, 63, 0.75)',
            borderColor: '#00853F',
            hoverBackgroundColor: '#FCD116',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#94A3B8',
              boxWidth: 14,
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#F8FAFC',
            bodyColor: '#CBD5E1',
            borderColor: '#334155',
            borderWidth: 1
          },
          title: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(148, 163, 184, 0.18)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(148, 163, 184, 0.18)' }
          }
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
            backgroundColor: this.generateColors(data.length),
            hoverBackgroundColor: this.generateColors(data.length),
            borderColor: '#0F172A',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#94A3B8',
              boxWidth: 14,
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#F8FAFC',
            bodyColor: '#CBD5E1',
            borderColor: '#334155',
            borderWidth: 1
          },
          title: { display: false }
        }
      }
    };
  }
  generateColors(length: number) {
    const palette = [
      '#38BDF8',
      '#22C55E',
      '#F97316',
      '#A855F7',
      '#EAB308',
      '#EF4444',
      '#14B8A6',
      '#F43F5E',
      '#8B5CF6',
      '#06B6D4',
      '#84CC16',
      '#FB7185',
      '#10B981',
      '#F59E0B'
    ];
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(palette[i % palette.length]);
    }
    return colors;
  }
}
