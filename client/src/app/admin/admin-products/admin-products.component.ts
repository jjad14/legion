import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AdminService } from '../admin.service';
import { IBrand } from 'src/app/shared/models/brand';
import { IType } from 'src/app/shared/models/productType';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  @ViewChild('brand', {static: false}) brandInput: ElementRef;
  @ViewChild('type', {static: false}) typeInput: ElementRef;

  adminForm: FormGroup;
  errors: string[];
  brands: IBrand[] = [];
  types: IType[] = [];

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private adminService: AdminService) { }

  ngOnInit(): void {
    this.getBrands();
    this.getTypes();
    this.createAdminForm();
  }

  getBrands() {
    this.adminService.getBrands()
      .subscribe(res => {
        this.brands = res;
      });
  }

  getTypes() {
    this.adminService.getTypes()
      .subscribe(res => {
        this.types = res;
      });
  }

  createAdminForm() {
    this.adminForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(1)]],
      description: [null, [Validators.required, Validators.minLength(0), Validators.maxLength(200)]],
      price: [null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
      pictureUrl: [null],
      productTypeId: [null, [Validators.required]],
      productType: [null, [Validators.required]],
      productBrandId: [null, [Validators.required]],
      productBrand: [null, [Validators.required]]
    });
  }

  brandSelected(brand: IBrand) {
    this.adminForm.patchValue({
      productBrandId: brand.id,
      productBrand: {name: brand.name}
    });
    this.brandInput.nativeElement.value = brand.name;
  }

  typeSelected(type: IType) {
    this.adminForm.patchValue({
      productTypeId: type.id,
      productType: {name: type.name}
    });
    this.typeInput.nativeElement.value = type.name;
  }


  onSubmit() {
    this.adminForm.patchValue({
      price: +this.adminForm.get('price').value
    });

    this.adminService.createProduct(this.adminForm.value)
      .subscribe(res => {
        this.toastr.success('Product Successfully Created');
      }, error => {
        this.toastr.error('Could Not Create Product');
        // console.log(error);
        // this.errors = error.errors;
      });
  }

}
