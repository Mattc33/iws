import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { TrunksTableComponent } from './../../trunks-table.component';

import { TrunksService } from './../../../services/trunks.api.service';
import { TrunksSharedService } from './../../../services/trunks.shared.service';

@Component({
  selector: 'app-delete-trunks',
  templateUrl: './delete-trunks.component.html',
  styleUrls: ['./delete-trunks.component.scss'],
  providers: [ TrunksService ],
})
export class DeleteTrunksComponent implements OnInit {

    private rowObj;

    constructor(
        public dialogRef: MatDialogRef <TrunksTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private trunksService: TrunksService,
        private trunksSharedService: TrunksSharedService
    ) {}

    ngOnInit() {
        this.trunksSharedService.currentRowId.subscribe(data => this.rowObj = data);
    }

    click_delCarrier() {
        this.del_delTrunks();
        this.closeDialog();
    }

    del_delTrunks() {
        let rowId: number;
        for ( let i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.trunksService.del_deleteTrunk(rowId)
                .subscribe(resp => console.log(resp));
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
