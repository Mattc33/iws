export default class ImporterTableGridHelper {

    static createColumnDefs = (): Array<{}> => {
        return [
            {
                headerName: 'Ratecard Name', field: 'ratecard_name',
                cellRenderer: 'agGroupCellRenderer', width: 350,
                valueFormatter: function(params) {
                    const ratecard_name = params.data.ratecard_name;
                    if ( ratecard_name ) {
                        const country = ratecard_name.split('#');
                        return country[0] + ' - ' + country[2];
                    } else {
                        return ratecard_name;
                    }
                },
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix', width: 150,
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Private Offer',
                marryChildren: true,
                children: [
                    {
                        headerName: 'Buy Rate', field: 'private_buy_rate', width: 160,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Sell Rate', field: 'private_sell_rate', width: 140,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Difference', width: 170,
                        valueGetter: function(params) {
                            if (params.data.private_buy_rate > 0) {
                                const diff = (params.data.private_sell_rate - params.data.private_buy_rate);
                                const percent = ((diff) / params.data.private_buy_rate) * 100;
                                const diffFixed = diff.toFixed(4);
                                const percentFixed = percent.toFixed(2);
                                return `${diffFixed}(${percentFixed}%)`;
                            } else {
                                return '';
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Confirmed?', field: 'private_confirmed', width: 120, editable: true,
                        cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                    }
                ]
            }
        ]
    }

}
