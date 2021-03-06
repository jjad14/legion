import { Component, OnInit } from '@angular/core';

import { CartService } from './cart/cart.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Legion';

  constructor(private cartService: CartService, private accountService: AccountService) { }

  ngOnInit() {
    this.loadBasket();
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('token');

    this.accountService.loadCurrentUser(token)
      .subscribe(() => {
        console.log('Loading user...');
      }, error => {
        console.log(error);
      });

  }

  loadBasket() {
    const cartId = localStorage.getItem('cart_id');

    if (cartId) {
      this.cartService.getCart(cartId)
        .subscribe(() => {
          console.log('Initialized cart...');
        }, error => {
          console.log(error);
        });
    }
  }

}
