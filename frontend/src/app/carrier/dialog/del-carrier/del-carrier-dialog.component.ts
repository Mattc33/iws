import { Component, Inject, OnInit, AnimationKeyframe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierService } from '../../services/carrier.service';
import { TableService } from '../../services/table.service';

import { CarrierUiComponent } from './../../carrier-ui/carrier-ui.component';

@Component({
    selector: 'app-del-carrier-dialog-inner',
    templateUrl: './del-carrier-dialog.component.html',
    providers: [ CarrierService ],
  })
  export class DelCarrierDialogComponent implements OnInit {

    addCarrierFormGroup: FormGroup;
    post: any;

    ifDialog: number;

    constructor(
      public dialogRef: MatDialogRef <CarrierUiComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private carrierService: CarrierService,
      private tableService: TableService,
    ) {
    }

    ngOnInit() {
      this.tableService.currentIfDialog.subscribe(receivedRowID => this.ifDialog = receivedRowID);
    }

    delCarrier() {

      let x = this.data.rowID;
      console.log('-------------  ' + x);

      if (this.data.rowID !== 0) {
        // subscribe to carrier service del rout+e
        this.carrierService.delDeleteRow(this.data.rowID)
          .subscribe(result => console.log(result));

        // pass 1 true to carrier-table for row deletion
        this.tableService.changeIfDialog(1);
      } else {
        return;
      }
    }

    // On method call close dialog
    onNoClick(): void {
      this.dialogRef.close();
    }

  }
