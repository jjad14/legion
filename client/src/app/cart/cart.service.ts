import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ICart, ICartTotals, ICartItem, Cart } from '../shared/models/cart';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;

  private cartSource = new BehaviorSubject<ICart>(null);
  cart$ = this.cartSource.asObservable();

  private cartTotalSource = new BehaviorSubject<ICartTotals>(null);
  cartTotal$ = this.cartTotalSource.asObservable();

  shipping = 0;

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payment/' + this.getCurrentCartValue().id, {})
              .pipe(
                map((cart: ICart) => {
                  this.cartSource.next(cart);
                })
              );
  }

  getCart(id: string) {
    return this.http.get(this.baseUrl + 'cart?id=' + id)
      .pipe(
        map((cart: ICart) => {
          this.cartSource.next(cart);
          this.shipping = cart.shippingPrice;
          this.calculateCartTotalCosts();
        })
      );
  }

  setCart(cart: ICart) {
    return this.http.post(this.baseUrl + 'cart', cart)
      .subscribe((res: ICart) => {
        this.cartSource.next(res);
        this.calculateCartTotalCosts();
      }, error => {
        console.log(error);
      });
  }

  getCurrentCartValue() {
    return this.cartSource.value;
  }

  addItemToCart(item: IProduct, quantity = 1) {
    const itemToAdd: ICartItem = this.mapProductToCart(item, quantity);
    const cart = this.getCurrentCartValue() ?? this.createCart();

    cart.items = this.addOrUpdateCart(cart.items, itemToAdd, quantity);
    this.setCart(cart);
  }

  incrementQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.id === item.id);

    cart.items[itemIndex].quantity++;
    this.setCart(cart);
  }

  decrementQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.id === item.id);

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity--;
      this.setCart(cart);
    } else {
      this.removeItemFromCart(item);
    }
  }

  removeItemFromCart(item: ICartItem) {
    const cart = this.getCurrentCartValue();

    if (cart.items.some(x => x.id === item.id)) {
      cart.items = cart.items.filter(i => i.id !== item.id);
      if (cart.items.length > 0) {
        this.setCart(cart);
      } else {
        this.deleteCart(cart);
      }
    }
  }

  deleteCart(cart: ICart) {
    return this.http.delete(this.baseUrl + 'cart?id=' + cart.id)
      .subscribe(() => {
        this.cartSource.next(null);
        this.cartTotalSource.next(null);
        localStorage.removeItem('cart_id');
      }, error => {
        console.log(error);
      });
  }

  deleteLocalCart(id: string) {
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const cart = this.getCurrentCartValue();

    cart.deliveryMethodId = deliveryMethod.id;
    cart.shippingPrice = deliveryMethod.price;

    this.calculateCartTotalCosts();
    this.setCart(cart);
  }

  private calculateCartTotalCosts() {
    const cart = this.getCurrentCartValue();
    const shipping = this.shipping;
    const subtotal = cart.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;

    this.cartTotalSource.next({ shipping, total, subtotal });
  }

  private addOrUpdateCart(items: ICartItem[], itemToAdd: ICartItem, quantity: number): ICartItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createCart(): ICart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);

    return cart;
  }

  private mapProductToCart(item: IProduct, quantity: number): ICartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }

}
