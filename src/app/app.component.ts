import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GithubService } from './services/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private abonnements: Subscription[] = [];
  public allSenegaleseData: any[] = [];
  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.obtenirContributionsSenegal();
    this.githubService.retourListeUsers$.subscribe((result) => {
      console.log('==============================================');
      console.log('result', result);

      console.log('==============================================');
      if (result) {
        this.allSenegaleseData = result;
      }
    });
  }

  ngOnDestroy(): void {
    this.abonnements.forEach((abo) => {
      abo.unsubscribe();
    });
  }
}
