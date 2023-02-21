import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public renderColumn(element: any, column: string) {
    switch (column) {
      case 'avatarUrl':
        return `<img  src="${element[column]}" width="50" height="50" class="rounded my-1 me-sm-1" alt="" srcset="">`;
      case 'commits':
        return `<span>${element.contributionsCollection.totalCommitContributions}</span>`;
      case 'contributions':
        return `<span>${element.contributionsCollection.contributionCalendar.totalContributions}</span>`;
      case 'totalContributions':
        return `<span>${
          element.contributionsCollection.totalCommitContributions +
          element.contributionsCollection.contributionCalendar.totalContributions
        }</span>`;

      default:
        return `<span>${element[column]}</span>`;
    }
  }
}
