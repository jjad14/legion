import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IProduct } from 'src/app/shared/models/product';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsModalComponent } from 'src/app/shared/modals/products-modal/products-modal.component';

@Component({
  selector: 'app-admin-delete-product',
  templateUrl: './admin-delete-product.component.html',
  styleUrls: ['./admin-delete-product.component.scss']
})
export class AdminDeleteProductComponent implements OnInit {
  products: Partial<IProduct[]>;
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.adminService.getProducts()
    .subscribe(prods => {
      this.products = prods;
    });
  }

  openProductModal(product: IProduct) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        product,
        name: product.name,
        description: product.description,
        price: product.price
      }
    };
    this.bsModalRef = this.modalService.show(ProductsModalComponent, config);
    this.bsModalRef.content.updateSelectedProduct.subscribe(values => {
      const prod = {
        name: values.name,
        description: values.description,
        price: values.price
      };

      this.adminService.updateProduct(product.id, prod)
        .subscribe(() => {
          this.getProducts();
        });
    });
  }

  deleteProduct(product: IProduct) {
    this.adminService.deleteProduct(product.id)
      .subscribe(result => {
        if (result) {
          this.toastr.success('Deleted Successfully');
          this.getProducts();
        } else {
          this.toastr.error('Failed to delete');
        }
      });
  }

}
