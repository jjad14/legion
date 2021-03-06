import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';
import { ICart, ICartItem, ICartTotals } from '../shared/models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<ICart>;
  cartTotals$: Observable<ICartTotals>;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotal$;
  }

  removeItem(item: ICartItem) {
    this.cartService.removeItemFromCart(item);
  }

  incrementItem(item: ICartItem) {
    this.cartService.incrementQuantity(item);
  }

  decrementItem(item: ICartItem) {
    this.cartService.decrementQuantity(item);
  }

}
