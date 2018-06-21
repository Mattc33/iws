import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({

  templateUrl: './error.snackbar.component.html',
  styleUrls: ['./error.snackbar.component.scss'],
})
export class ErrorSnackbarComponent {

  constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any ) {

  }

}
