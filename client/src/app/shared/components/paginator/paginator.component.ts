import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() totalCount: number;
  @Input() pageSize: number;
  @Input() pageNumber: number;

  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onPageChanged(event: any) {
    this.pageChanged.emit(event.page);
  }

}
