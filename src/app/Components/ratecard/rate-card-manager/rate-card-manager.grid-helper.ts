export default class RatecardManagerGridHelper {

    static createColumnDefs = (): Array<{}> => {
        return [
            {
                headerName: '', width: 50, field: 'isEmpty',
                valueGetter: params => Object.keys(params.data).length >= 5 ? 1 : 0,
                filter: "agNumberColumnFilter",
                hide: true
            },
            {
                headerName: '#', width: 50,
                valueGetter: params => {
                    if(Object.keys(params.data).length >= 5) {
                        return params.node.rowIndex + 1
                    }
                },
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'line-height': '70px', 'font-weight': 'bold', 'text-align': 'center'},
                suppressFilter: true
            },
            {
                headerName: 'Countries', field: 'countries', colId: 'countries', width: 140,
                cellStyle: { 'border-right': '1px solid #000', 'line-height': '70px',
                'font-weight': 'bold' }, 
                filter: "agTextColumnFilter",
            },
            {
                headerName: 'Obie Rate', field: 'finalRate', colId: 'finalRate', width: 220,
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'border-left': '1px solid #000' },
                cellRenderer: '_obietelCellComponent',
                headerComponent: '_obieHeaderComponent'
            },
            // {
            //     headerName: 'Min Rate', field: 'fixedMinimumRate', colId: 'fixedMinimumRate',
            //     width: 120,
            //     cellStyle: commonCellStyle,
            // },
            // {
            //     headerName: 'Prev Rate', field: 'previousRate', colId: 'previousRate',
            //     width: 120,
            //     cellStyle: commonCellStyle,
            // }
        ]
    }
}