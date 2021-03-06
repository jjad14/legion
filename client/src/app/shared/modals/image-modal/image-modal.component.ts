import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IProduct } from '../../models/product';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {
  product: IProduct;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateProduct() {
    this.bsModalRef.hide();
  }
}
