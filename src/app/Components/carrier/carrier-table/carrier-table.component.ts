import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { GridApi } from 'ag-grid'
import { DelCarrierDialogComponent } from './dialog/del-carrier/del-carrier-dialog.component'
import { AddCarrierDialogComponent } from './dialog/add-carrier/add-carrier-dialog.component'
import { CarrierService } from '../../../shared/api-services/carrier/carrier.api.service'
import { CarrierSharedService } from '../../../shared/services/carrier/carrier.shared.service'
import { SnackbarSharedService } from '../../../shared/services/global/snackbar.shared.service'
import { ToggleButtonStateService } from '../../../shared/services/global/buttonStates.shared.service'
@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss']
})
export class CarrierTableComponent implements OnInit {

    // * row data and column definitions
    rowData: Array<{}>
    columnDefs: Array<{}>

    // * gridApi & gridUI props
    gridApi: GridApi
    quickSearchValue: string = ''
    rowSelection: string = 'single'

    // ? Internal Service
    rowObj

    // * UI Props
    gridSelectionStatus: number;

    constructor(
        private _carrierService: CarrierService,
        private _carrierSharedService: CarrierSharedService,
        private _dialog: MatDialog,
        private snackbarSharedService: SnackbarSharedService,
        private toggleButtonStateService: ToggleButtonStateService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_carrierRowData();
        this._carrierSharedService.currentRowObj.subscribe( giveRowObj => this.rowObj = giveRowObj)
    }

    // ================================================================================
    // * Carrier API Service
    // ================================================================================
    get_carrierRowData(): void {
        this._carrierService.get_carriers().subscribe(
            data =>  this.rowData = data,
            error =>  console.log(error)
        )
    }

    put_editCarrier(carrierObj: object, id: number): void {
        this._carrierService.put_EditCarrier(carrierObj, id)
            .subscribe(
                (resp: Response) => {
                    console.log(resp)
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Edit Successful.', 2000)
                    }
                },
                error => {
                    console.log(error)
                    this.snackbarSharedService.snackbar_error('Edit failed.', 2000)
                }
            )
    }

    // ================================================================================
    // * AG Grid Init
    // ================================================================================
    onGridReady(params): void {
        this.gridApi = params.api
        params.api.sizeColumnsToFit()
    }

    private createColumnDefs(): Array<{}> {
        return [
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                sort: 'asc'
            },
            {
                headerName: 'Phone Number', field: 'phone',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Email', field: 'email',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Address', field: 'address',
                width: 400, editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true, width: 120,
                cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Tier', field: 'tier', editable: true, width: 120,
                cellEditor: 'select', cellEditorParams: {values: [ 1, 2, 3, 4, 5]},
                filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Code', field: 'code', width: 120,
                editable: true,
            }
        ]
    }

    // ================================================================================
    // * Grid UI Interactions
    // ================================================================================
    gridSizeChanged(params): void {
        params.api.sizeColumnsToFit()
    }

    selectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows()
        this.rowObj = selectedRows;
    }

    // ================================================================================
    // * AG Grid Events
    // ================================================================================
    rowSelected(): void { // Toggle button boolean if rowSelected > 0
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length
    }

    toggleButtonStates(): boolean {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus)
    }

    onQuickFilterChanged(): void { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue)
    }

    // ================================================================================
    // * AG Grid Interactions
    // ================================================================================
    onRefreshRowData = () => this._carrierService.get_carriers().subscribe(data => this.gridApi.setRowData(data))
    
    onCellValueChanged(params: any): void {
        const id: number = params.data.id
        const taxable: boolean = this.isTaxable(params.data.taxable)
        const carrierObj = {
            code: params.data.code,
            name: params.data.name,
            email: params.data.email,
            phone: params.data.phone,
            address: params.data.address,
            taxable: taxable,
            tier: parseInt(params.data.tier, 0)
        }
        this.put_editCarrier(carrierObj, id)
    }

    // ? utils
    isTaxable = (taxableString: string): boolean => (taxableString == 'true') ? true : false

    // ================================================================================
    // * Carrier Dialog
    // ================================================================================
    openDialogAdd(): void {
        const dialogRef = this._dialog.open(AddCarrierDialogComponent, {
            width: '40%',
        })
        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData()
        })
    }

    openDialogDel(): void {
        this._carrierSharedService.changeRowObj(this.rowObj)
        const dialogRef = this._dialog.open(DelCarrierDialogComponent, {})
        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData();
        })
    }

}
