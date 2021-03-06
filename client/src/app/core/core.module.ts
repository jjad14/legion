import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    PageHeaderComponent,
    AboutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    BreadcrumbModule,
    NgxNavbarModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
  exports: [NavBarComponent, FooterComponent, PageHeaderComponent]
})
export class CoreModule { }
