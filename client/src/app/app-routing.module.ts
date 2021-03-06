import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AboutComponent } from './core/about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    data: {breadcrumb: 'Shop'}
  },
  {path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
    data: {breadcrumb: 'Cart'}
  },
  {path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    data: {breadcrumb: 'Checkout'}
  },
  {path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    data: {breadcrumb: { skip: true }}
  },
  {path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
    data: {breadcrumb: 'Orders'}
  },
  {path: 'server-error',
    component: ServerErrorComponent,
    data: {breadcrumb: 'Server Error'}
  },
  {path: 'not-found',
    component: NotFoundComponent,
    data: {breadcrumb: 'Not Found'}
  },
  {path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: {breadcrumb: 'Admin'}
  },
  {path: 'about',
    component: AboutComponent,
    data: {breadcrumb: 'About'}
  },
  {path: '**', redirectTo: 'not-found', pathMatch: 'full', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
