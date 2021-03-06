import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminDeleteProductComponent } from './admin-delete-product/admin-delete-product.component';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminProductsComponent,
    AdminDeleteProductComponent,
    AdminUserManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
