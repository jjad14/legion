import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pagining-header',
  templateUrl: './pagining-header.component.html',
  styleUrls: ['./pagining-header.component.scss']
})
export class PaginingHeaderComponent implements OnInit {
  @Input() totalCount: number;
  @Input() pageSize: number;
  @Input() pageNumber: number;

  constructor() { }

  ngOnInit() {
  }

}
