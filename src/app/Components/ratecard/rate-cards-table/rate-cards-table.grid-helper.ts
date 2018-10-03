export class RatecardsTableGridHelper {
    
    static createRatecardColumnDefs = (): Array<{}> => {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
                sort: 'asc'
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name', 
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Date Added', editable: true, field: 'dateAdded',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier ID', field: 'carrier_id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'LCR ID', field: 'lcr_id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Tools'
            }
        ]
    }

    static createRatesColumnDefs = (): Array<{}> => {
        return [
            {
                headerName: 'Prefix', field: 'prefix',
                checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination', field: 'destination', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Difference',
                valueGetter: function(params) {
                    const diff = (params.data.sell_rate - params.data.buy_rate)
                    const percent = ((diff) / params.data.buy_rate) * 100
                    const diffFixed = diff.toFixed(4)
                    const percentFixed = percent.toFixed(2)
                    return `${diffFixed}(${percentFixed}%)`
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', width: 100,
                valueFormatter: function(params) {
                    return (params.value === 1) ? true : false
                }
            }
        ]
    }

    static createTrunksColumnDefs = (): Array<{}> => {
        return [
            {
                headerName: 'Trunk Id', field: 'cx_trunk_id',
                checkboxSelection: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Meta Data', field: 'metadata',
            }
        ]
    }
}