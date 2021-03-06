import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { CartService } from 'src/app/cart/cart.service';
import { ImageModalComponent } from 'src/app/shared/modals/image-modal/image-modal.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  bsModalRef: BsModalRef;
  product: IProduct;
  quantity = 1;

  constructor(private shopSerivce: ShopService,
              private cartService: CartService,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private bcService: BreadcrumbService) {
                this.bcService.set('@productDetails', ' ');
               }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    this.shopSerivce.getProductById(+this.activatedRoute.snapshot.paramMap.get('id'))
      .subscribe(res => {
        this.product = res;
        this.bcService.set('@productDetails', res.name);
      }, error => {
        console.log(error);
      });
  }

  addItemToBasket() {
    this.cartService.addItemToCart(this.product, this.quantity);
  }

  incrementItem() {
    this.quantity++;
  }

  decrementItem() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  openImageModal(product: IProduct) {
    const config = {
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        product
      }
    };
    this.bsModalRef = this.modalService.show(ImageModalComponent, config);

  }

}
