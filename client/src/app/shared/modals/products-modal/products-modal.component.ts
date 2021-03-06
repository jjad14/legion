import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { IProduct } from '../../models/product';

@Component({
  selector: 'app-products-modal',
  templateUrl: './products-modal.component.html',
  styleUrls: ['./products-modal.component.scss']
})
export class ProductsModalComponent implements OnInit {
  @Input() updateSelectedProduct = new EventEmitter();
  product: IProduct;
  name: string;
  description: string;
  price: number;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateProduct() {
    const data = {
      name: this.name,
      description: this.description,
      price: this.price,
    };

    this.updateSelectedProduct.emit(data);
    this.bsModalRef.hide();
  }

}
