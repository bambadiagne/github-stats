import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() public dataSource = new MatTableDataSource<any>([]);
  @Input() public displayedColumns: string[] = [];
  public defaultImage = 'https://place-hold.it/200x200/';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public renderColumn(element: any, column: string) {
    switch (column) {
      case 'avatarUrl':
        const image = element[column];
        return `<a href="javascript:void(0)" ><img data-link=${element.login}  src="${element[column]}"   width="50" height="50" class="rounded my-1 me-sm-1 img-fluid" ></a >`;
      case 'commits':
        return `<span>${element.contributionsCollection.totalCommitContributions}</span>`;
      case 'login':
        return `<strong><a class='text-decoration-none' style='color: inherit;' data-link=${element.login} href="javascript:void(0)">${element.login}</a ></strong>`;

      case 'contributions':
        return `<span>${
          element.contributionsCollection.contributionCalendar.totalContributions -
          element.contributionsCollection.restrictedContributionsCount
        }</span>`;
      case 'totalContributions':
        return `<span>${element.contributionsCollection.contributionCalendar.totalContributions}</span>`;

      default:
        return `<span>${element[column] ?? 'Non renseigné'}</span>`;
    }
  }
  public getRoute(event: any) {
    const goRoute = event.target.getAttribute('data-link');
    console.log('route', goRoute);

    this.router.navigate(['/users', goRoute]);
  }
}
