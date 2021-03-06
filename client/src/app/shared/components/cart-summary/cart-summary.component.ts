import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { CartService } from 'src/app/cart/cart.service';
import { ICart, ICartItem } from '../../models/cart';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {
  @Input() isCartEnabled = true;
  @Input() items: ICartItem[] | IOrderItem[] = [];
  @Input() isOrder = false;

  @Output() decrement: EventEmitter<ICartItem> = new EventEmitter<ICartItem>();
  @Output() increment: EventEmitter<ICartItem> = new EventEmitter<ICartItem>();
  @Output() remove: EventEmitter<ICartItem> = new EventEmitter<ICartItem>();

  constructor() { }

  ngOnInit(): void {
  }

  decrementItem(item: ICartItem) {
    this.decrement.emit(item);
  }

  incrementItem(item: ICartItem) {
    this.increment.emit(item);
  }

  removeItem(item: ICartItem) {
    this.remove.emit(item);
  }

}
