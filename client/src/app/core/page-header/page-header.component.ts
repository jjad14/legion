import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  breadcrumb$: Observable<any[]>;

  constructor(private bcService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }

}
