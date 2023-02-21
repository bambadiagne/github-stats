import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SingleUser, User, UserContributions } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public retourListeUsers$: Subject<any[]> = new Subject();
  public retourDetailUser$: Subject<any> = new Subject();
  public route = 'http://localhost:5000/users';
  public query = new Map();

  constructor(private http: HttpClient) {}

  public async obtenirContributionsSenegal() {
    this.appelerServiceContributions().subscribe(
      (reponse: UserContributions[]) => {
        if (reponse) {
          this.retourListeUsers$.next(reponse);
        } else {
          this.retourListeUsers$.next([]);
        }
      },
      () => {
        this.retourListeUsers$.next(null as unknown as any[]);
      }
    );
  }

  public filtrer(query: Map<string, string>) {
    this.updateQuery(query);
    this.appelerServiceListe().subscribe((reponse: User[]) => {
      if (reponse) {
        this.retourListeUsers$.next(reponse);
      } else {
        this.retourListeUsers$.next([]);
      }
    });
  }

  public obtenirDetailUser(login: string) {
    this.appelerServiceDetail(login).subscribe((reponse: SingleUser | any) => {
      if (reponse) {
        this.retourDetailUser$.next(reponse);
      } else {
        this.retourDetailUser$.next(null);
      }
    });
  }
  private appelerServiceListe(): Observable<User[] | any> {
    return this.http.get<any[]>(`${this.route}/search${this.genererQueryString()}`);
  }

  private appelerServiceContributions(): Observable<UserContributions[]> {
    return this.http.get<any[]>(`${this.route}/contributions/senegal`);
  }
  private appelerServiceDetail(login: string) {
    return this.http.get<any>(`${this.route}/${login}`);
  }

  private genererQueryString(): string {
    let queryString = '?';
    for (const entree of this.query.entries()) {
      queryString += `${entree[0]}=${entree[1]}&`;
    }
    return queryString.substr(0, queryString.length - 1);
  }

  private updateQuery(query: Map<string, string>) {
    if (query.size > 0) {
      for (const entree of query.entries()) {
        this.query.set(entree[0], entree[1]);
      }
    }
  }
}
