import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Account } from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {
  }

  verifyAccountExist(idAccount: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${idAccount}`)
      .pipe(catchError(this.handleError),
        map(response => {
          return response;
        }));
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<{ data: Account[] }>(this.apiUrl)
      .pipe(
        catchError(this.handleError),
        map(response => {
          return response.data;
        })
      );
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account)
      .pipe(
        catchError(this.handleError)
      );
  }

  editAccount(idAccount: string, account: Account): Observable<Account> {
    console.log(`${this.apiUrl}/${account.id}`);
    return this.http.put<Account>(`${this.apiUrl}/${idAccount}`, account)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
