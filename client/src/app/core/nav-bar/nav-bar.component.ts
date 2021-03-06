import { ChangeDetectionStrategy, Component, DoCheck, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICart } from 'src/app/shared/models/cart';
import { CartService } from 'src/app/cart/cart.service';
import { IUser } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  cart$: Observable<ICart>;
  currentUser$: Observable<IUser>;

  constructor(private cartService: CartService, private accountService: AccountService) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.currentUser$ = this.accountService.currentUser$;
  }

  onLogout() {
    this.accountService.logout();
  }

}
