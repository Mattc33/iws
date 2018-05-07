import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SuccessSnackbarComponent } from './../../components/snackbars/success/success.snackbar.component';
import { ErrorSnackbarComponent } from './../../components/snackbars/error/error.snackbar.component';

@Injectable()
export class SnackbarSharedService {

    constructor(public snackBar: MatSnackBar) {}

    snackbar_success(msg: string, duration: number): void {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          duration: duration,
          data: msg,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: 'snackbar-success-container'
        });
    }

    snackbar_error(msg: string, duration: number): void {
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          duration: duration,
          data: msg,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: 'snackbar-error-container'
        });
    }

    snackbar_info(msg: string, duration: number): void {

    }
}
