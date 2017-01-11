import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { PartiesList } from "../shared-components/parties-list.class";
import { MdSnackBar } from "@angular/material";
//import { MdDialog} from "@angular/material";

import template from './parties-list.component.mobile.html';

@Component({
  selector: 'parties-list',
  template
})
export class PartiesListMobileComponent extends PartiesList {
  constructor(paginationService: PaginationService, snackBar: MdSnackBar) {
    super(paginationService,snackBar);
  }
}
