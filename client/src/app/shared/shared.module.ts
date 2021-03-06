import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { PaginingHeaderComponent } from './components/pagining-header/pagining-header.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';
import { ProductsModalComponent } from './modals/products-modal/products-modal.component';
import { ImageModalComponent } from './modals/image-modal/image-modal.component';


@NgModule({
  declarations: [
    PaginingHeaderComponent,
    PaginatorComponent,
    OrderTotalsComponent,
    TextInputComponent,
    StepperComponent,
    CartSummaryComponent,
    HasRoleDirective,
    RolesModalComponent,
    ProductsModalComponent,
    ImageModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    RouterModule,
    NgxImageZoomModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    PaginationModule,
    PaginingHeaderComponent,
    PaginatorComponent,
    CarouselModule,
    TabsModule,
    ModalModule,
    NgxImageZoomModule,
    OrderTotalsComponent,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    TextInputComponent,
    CdkStepperModule,
    AccordionModule,
    StepperComponent,
    CartSummaryComponent,
    HasRoleDirective
  ]
})
export class SharedModule { }
