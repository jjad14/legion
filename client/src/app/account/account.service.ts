import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers})
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  setCurrentUser(user: IUser) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;

    // check if roles from token is an array or string
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('token', user.token);
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailverify?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address/edit', address);
  }

  getDecodedToken(token) {
    // atob will allow us to decode the information inside what the token is returned as
    // access and return the payload
    return JSON.parse(atob(token.split('.')[1]));
  }

}
