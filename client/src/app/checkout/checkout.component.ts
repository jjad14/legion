import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { IAddress } from '../shared/models/address';
import { CartService } from '../cart/cart.service';
import { Observable } from 'rxjs';
import { ICartTotals } from '../shared/models/cart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartTotals$: Observable<ICartTotals>;
  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder, private accountService: AccountService, private cartService: CartService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddress();
    this.getDeliveryMethodValue();
    this.cartTotals$ = this.cartService.cartTotal$;
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        province: [null, Validators.required],
        postalCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddress() {
    this.accountService.getUserAddress()
      .subscribe((address: IAddress) => {
        if (address) {
          this.checkoutForm.get('addressForm').patchValue(address);
        }
      }, error => {
        console.log(error);
      });
  }

  getDeliveryMethodValue() {
    const cart = this.cartService.getCurrentCartValue();

    if (cart.deliveryMethodId !== null) {
      this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(cart.deliveryMethodId.toString());
    }
  }

}
