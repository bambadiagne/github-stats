import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SingleUser, User, UserContributions } from '../models/user';
import { ApiError } from '../models/error-api';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public retourListeUsers$: Subject<any[]> = new Subject();
  public retourListeSearch$: Subject<any> = new Subject();
  public retourDetailUser$: Subject<SingleUser> = new Subject();
  public route = 'https://github-user-stats.onrender.com/users';
  public messageErreur$: Subject<any> = new Subject();
  public query: Map<string, string[]> = new Map<string, string[]>();

  constructor(private http: HttpClient) {}

  public async obtenirContributionsSenegal() {
    this.appelerServiceContributions().subscribe({
      next: (reponse: UserContributions[]) => {
        this.retourListeUsers$.next(reponse);
      },
      error: (erreur) => {
        this.messageErreur$.next(this.handleError(erreur));
      }
    });
  }

  public filtrer(query: Map<string, string[]>) {
    this.updateQuery(query);

    this.appelerServiceListe().subscribe({
      next: (reponse: User[]) => {
        this.retourListeSearch$.next(reponse);
      },
      error: (erreur) => {
        this.messageErreur$.next(this.handleError(erreur));
      }
    });
  }

  public obtenirDetailUser(login: string) {
    this.appelerServiceDetail(login).subscribe({
      next: (reponse: SingleUser) => {
        this.retourDetailUser$.next(reponse);
      },
      error: (erreur) => {
        this.messageErreur$.next(this.handleError(erreur));
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
  public handleError(error: HttpErrorResponse | ApiError): string {
    if (error.message.includes('Http failure response for')) {
      return 'Impossible de se connecter au serveur';
    }
    return error.message;
  }
  private updateQuery(query: Map<string, string[]>) {
    for (const entree of query.entries()) {
      this.query.set(entree[0], entree[1]);
    }
  }
}
