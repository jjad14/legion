import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$
      .pipe(
        map(user => {
          if (user.roles.includes('Admin') || user.roles.includes('Employee')) {
            return true;
          }
          this.toastr.error('You are unauthorized');
          // this.router.navigate(['/'], {queryParams: {returnUrl: state.url}});
        })
      );
  }

}
