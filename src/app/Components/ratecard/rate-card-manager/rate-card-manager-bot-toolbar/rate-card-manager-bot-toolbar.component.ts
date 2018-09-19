import { Component, Input }         from '@angular/core'
import { RatecardManagerService }   from './../../../../shared/api-services/ratecard/rate-card-manager.api.service';
import FilesUtils                   from '../../../../shared/utils/files/files.utils'

@Component({
    selector: 'app-rate-card-manager-bot-toolbar',
    templateUrl: './rate-card-manager-bot-toolbar.component.html',
    styleUrls: ['./rate-card-manager-bot-toolbar.component.scss']
})
export class RateCardManagerBotToolbarComponent {

    @Input() _tableRowData: Array<any>
    @Input() _markUp: number
    @Input() _tableColDef: Array<any>

    // ! string interpolation values
    downloadAsDisabled = false

    constructor(
        private _ratecardManagerService: RatecardManagerService
    ) { }

    // ================================================================================
    // * Save Profile API Services
    // ================================================================================
    saveCarrierListToProfile = () => {
        this._ratecardManagerService.post_carrierListToProfile
    }

    // example of post body
    /*
        {
            "rateMarkup": 0,                           <-- access this from parent's markUp prop
            "fromCarrierList": [                       <-- form using ratecardTable
                {           
                    "country_iso": "string",
                    "fromCarrier": [
                        {
                            "fromCarrierId": 0,        <-- from Carrier Id should be attached in an arr
                            "rateCardTier": "string"   <-- from ratecardTier should be attached in an arr
                        }
                    ]
                }
            ],
            "customerRateList": [
                {
                    "country_iso": "string",
                    "finalRate": 0,                    <-- Custom Rate
                    "minRate": 0
                }
            ]
        }
    */

    saveCarrierRatesInfoToProfile = () => {
        this._ratecardManagerService.post_carrierRatesInfoToProfile
    }

    // example of post body
    /*
        {
            "profile": {
                "rateMarkup": 0,
                "fromCarrierList": [
                    {
                        "country_iso": "string",
                        "fromCarrier": [
                            {
                                "fromCarrier_id": 0,
                                "rateCardTier": "string"
                            }
                        ]
                    }
                ],
                "customerRateList": [
                    {
                        "country_iso": "string",
                        "finalRate": 0,
                        "minRate": 0
                    }
                ]
            }
        }
    */

    // ================================================================================
    // * Save Profile
    // ================================================================================
    saveProfile = () => {

        //create body 
        const bodyTemplate= {
            "rateMarkup": this._markUp,
            "fromCarrierList": [

            ],
            "customerRateList": [

            ]
        }

        const fromCarrierList = this._tableRowData.map( eaCountry => {
            // getCarrierId by matching rowColId with colField
            let carrierId: number
            if (eaCountry.hasOwnProperty('currentSelectedRatecard')) {
                const currentRatecard = eaCountry.currentSelectedRatecard[0]

                this._tableColDef.forEach( eaCol => {
                    if(eaCol.hasOwnProperty('field') && eaCol.field === currentRatecard) {
                        carrierId = eaCol.carrierId
                    }
                })

                return {
                    "country_iso": eaCountry.code,
                    "fromCarrier": [
                        "fromCarrier_id": 
                    ]
                }
            }



        })

        // deep clone tableRowObj
        // deep clone tableColObj

    }

    // ================================================================================
    // * Download as... for A2Billing
    // ================================================================================
    downloadForA2Billing = (fileType: string) => {
        const A2BillingObj = JSON.parse(JSON.stringify(this._tableRowData)) // deep clone tableRowObj from parent
        const preppedJson = this.filterOutTableData(A2BillingObj)
        const applyCustom = this.applyCustomRate(preppedJson)
        const A2BillingFormatJson = this.processIntoA2BillingFormat(applyCustom)
        const csv = FilesUtils.jsonToCsv(A2BillingFormatJson, {header: false}, 
            ['prefix', 'destination', 'sell_rate', 'sell_rate_minimum', 'sell_rate_increment',
            'buy_rate', 'buy_rate_minimum', 'buy_rate_increment'])
        FilesUtils.saveAsFile(csv, `result.${fileType}`)
    }

    filterOutTableData(A2BillingObj: any): any {
        const filteredDataIsChecked = A2BillingObj.filter( eaCountry => {
            return eaCountry.hasOwnProperty('currentSelectedRatecard')
        })
        if ( filteredDataIsChecked[0].hasOwnProperty('markUp')) {
            this._markUp = filteredDataIsChecked[0].markUp
            const preppedJson: any = filteredDataIsChecked.map( eaCountry => {
                const currentKey = eaCountry.currentSelectedRatecard[0]
                if(eaCountry[currentKey].hasOwnProperty('rates')) {
                    const relevantRates = eaCountry[currentKey].rates
                    return eaCountry.hasOwnProperty('customRate') ? [eaCountry.customRate, relevantRates] : relevantRates
                }
            })
            return preppedJson
        } 
        else {
            console.log('no markup value entered')
        }
    }

    applyCustomRate(preppedJson: any): any {
        const customRateList = preppedJson.map( eaCountry => {
            if (typeof(eaCountry[0]) === 'number') {
                eaCountry[1].forEach( eaPrefix => eaPrefix.sell_rate = eaCountry[0] )
                eaCountry.shift()
            }
            return eaCountry.flat()
        })
        return customRateList.flat()
    }

    processIntoA2BillingFormat(preppedJson: Array<any>): Array<any> {
        return preppedJson.map( eaPrefix => {
            let sell_rate: number
            eaPrefix.hasOwnProperty('sell_rate') 
                ? sell_rate = eaPrefix.sell_rate 
                : sell_rate = ((eaPrefix.buy_rate * this._markUp) / 100) + eaPrefix.buy_rate
            
            return {
                prefix: eaPrefix.prefix,
                destination: eaPrefix.destination,
                sell_rate: sell_rate,
                sell_rate_minimum: 1,
                sell_rate_increment: 1,
                buy_rate: eaPrefix.buy_rate,
                buy_rate_minimum: 1,
                buy_rate_increment: 1
            }
        })
    }

    test() {
        console.log(this._tableRowData)
        console.log(this._tableColDef)
    }
}
