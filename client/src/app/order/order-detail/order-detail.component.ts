import { Component, OnInit } from '@angular/core';

import { IOrder } from 'src/app/shared/models/order';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;

  constructor(private route: ActivatedRoute,
              private breadCrumbService: BreadcrumbService,
              private orderService: OrdersService) {
                this.breadCrumbService.set('@OrderDetail', '');
              }

  ngOnInit() {
    this.orderService.getOrderById(+this.route.snapshot.paramMap.get('id'))
      .subscribe((order: IOrder) => {
        this.order = order;
        this.breadCrumbService.set('@OrderDetail', `Order #${order.id} - ${order.status}`);
      }, error => {
        console.log(error);
      });
  }

}
