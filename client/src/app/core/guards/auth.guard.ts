import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountSerivce: AccountService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot, // this is the route that is attempting to be activated
    state: RouterStateSnapshot) // current router state, where the user is coming from
    : Observable<boolean | UrlTree> {

      return this.accountSerivce.currentUser$
        .pipe(
          map(auth => {
            if (auth) {
              return true;
            }
            this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}});
          })
        );
  }

}
