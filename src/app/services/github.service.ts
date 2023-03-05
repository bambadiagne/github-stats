import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SingleUser, User, UserContributions } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public retourListeUsers$: Subject<any[]> = new Subject();
  public retourListeSearch$: Subject<any> = new Subject();
  public retourDetailUser$: Subject<any> = new Subject();
  public route = 'http://localhost:5000/users';
  public query: Map<string, string[]> = new Map<string, string[]>();

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

  public filtrer(query: Map<string, string[]>) {
    this.updateQuery(query);

    this.appelerServiceListe().subscribe((reponse: any) => {
      if (reponse) {
        this.retourListeSearch$.next(reponse);
      } else {
        this.retourListeSearch$.next([]);
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
    return this.http.get<any[]>(`${this.route}/search${this.genererQueryString(this.query)}`);
  }

  private appelerServiceContributions(): Observable<UserContributions[]> {
    return this.http.get<any[]>(`${this.route}/contributions/senegal`);
  }
  private appelerServiceDetail(login: string) {
    return this.http.get<any>(`${this.route}/${login}`);
  }

  private genererQueryString(paramMap: Map<string, string[]>): string {
    let queryString = '';
    for (const [key, value] of paramMap) {
      const encodedKey = encodeURIComponent(key);
      for (const item of value) {
        const encodedValue = encodeURIComponent(item);
        if (queryString.length === 0) {
          queryString += `?${encodedKey}=${encodedValue}`;
        } else {
          queryString += `&${encodedKey}=${encodedValue}`;
        }
      }
    }
    return queryString;
  }

  // private genererQueryString(): string {
  //   let queryString = '?';
  //   for (const entree of this.query.entries()) {
  //     queryString += `${entree[0]}=${entree[1]}&`;
  //   }
  //   return queryString.substr(0, queryString.length - 1);
  // }

  private updateQuery(query: Map<string, string[]>) {
    for (const entree of query.entries()) {
      this.query.set(entree[0], entree[1]);
    }
  }
}
