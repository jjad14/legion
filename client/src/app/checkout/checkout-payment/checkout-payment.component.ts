import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { CartService } from 'src/app/cart/cart.service';
import { CheckoutService } from '../checkout.service';
import { ICart } from 'src/app/shared/models/cart';
import { IOrder } from 'src/app/shared/models/order';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;

  @ViewChild('cardNumber', {static: true}) cardNumberEl: ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryEl: ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcEl: ElementRef;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  loading = false;

  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(private cartService: CartService,
              private checkoutService: CheckoutService,
              private toastr: ToastrService,
              private router: Router) { }

  ngAfterViewInit() {
    this.stripe = Stripe(environment.stripeKey);
    const elements = this.stripe.elements();

    // mount the stripe elements on to native elements
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberEl.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryEl.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcEl.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChange(event) {
    if (event.error) {
      // error is coming from stripe, they do the validation
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  async submitOrder() {
    this.loading = true;

    const cart = this.cartService.getCurrentCartValue();

    try {
      const createdOrder = await this.createOrder(cart);
      const paymentResult = await this.confirmPaymentWithStripe(cart);

      if (paymentResult.paymentIntent) {
        this.cartService.deleteCart(cart);
        const navExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navExtras);
      } else {
        // payment was declined
        this.toastr.error(paymentResult.error.message);
        // this.toastr.error('Order Payment Failed, Please Try Again!');
      }
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
    }

  }

  private async confirmPaymentWithStripe(cart) {
    return this.stripe.confirmCardPayment(cart.clientSecret, {
      payment_method: {
        // we only need to put one of the elements and stripe will take care of the rest
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }

  private async createOrder(cart: ICart) {
    const orderToCreate = this.getOrderToCreate(cart);

    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private getOrderToCreate(cart: ICart) {
    return {
      cartId: cart.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
