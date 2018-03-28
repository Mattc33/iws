import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SuccessSnackbarComponent } from './../snackbars/success/success.snackbar.component';

@Injectable()
export class SnackbarSharedService {

    constructor(public snackBar: MatSnackBar) {}

    snackbar_success(msg: string, duration: number): void {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          duration: duration,
          data: msg,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'snackbar-success-container'
        });
    }

    snackbar_error(msg: string, duration: number): void {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          duration: duration,
          data: msg,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'snackbar-success-container'
        });
    }
}
