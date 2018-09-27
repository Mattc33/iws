import { Component, Input }         from '@angular/core'
import { RatecardManagerService }   from './../../../../shared/api-services/ratecard/rate-card-manager.api.service'
import FilesUtils                   from '../../../../shared/utils/files/files.utils'
import { RatecardManagerSharedService } from './../rate-card-manager-service/rate-card-manager.shared.service'

import RatecardUtils from './../../../../shared/utils/ratecard/rate-card.utils'

interface IPostCarrierListToProfile { 
    rateMarkup: number,
    fromCarrierList: Array<object>,
    customerRateList: Array<object>
}

interface IPostCarrierRatesInfoToProfile { 
    "profile": {
        rateMarkup: number,
        fromCarrierList: Array<object>,
        customerRateList: Array<object>
    }
}
@Component({
    selector: 'app-rate-card-manager-bot-toolbar',
    templateUrl: './rate-card-manager-bot-toolbar.component.html',
    styleUrls: ['./rate-card-manager-bot-toolbar.component.scss']
})
export class RateCardManagerBotToolbarComponent {

    @Input() _tableRowData: Array<any>
    @Input() _markUp: number
    @Input() _tableColDef: Array<any>
    @Input() _numberOfChecked: number

    // ! string interpolation values
    downloadAsDisabled = false

    constructor(
        private _ratecardManagerService: RatecardManagerService,
        private _ratecardManagerSharedService: RatecardManagerSharedService
    ) { }

    // ================================================================================
    // * Save Profile API Services
    // ================================================================================
    postCarrierListToProfile = (toCarrier_id: number, tier: string, body: IPostCarrierListToProfile) => {
        this._ratecardManagerService.post_carrierListToProfile(toCarrier_id, tier, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp)
                },
                error => {
                    console.log(error)
                }
            )
    }

    postCarrierRatesInfoToProfile = (toCarrier_id: number, tier: string, body: IPostCarrierRatesInfoToProfile) => {
        this._ratecardManagerService.post_carrierRatesInfoToProfile(toCarrier_id, tier, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp)
                },
                error => {
                    console.log(error)
                }
            )
    }

    // ================================================================================
    // * Save Profile
    // ================================================================================
    saveProfile = () => {
        let toCarrierId: number, toCarrierTier: string // ? subscribing and passing carrierID, toCarrierTier to fn scoped vars
        this._ratecardManagerSharedService.currentCarrierId.subscribe(o_carrierId => toCarrierId = o_carrierId)
        this._ratecardManagerSharedService.currentTier.subscribe(o_toCarrierTier => toCarrierTier = o_toCarrierTier)
        
        if ( this._numberOfChecked <= 0) {
            alert('Please select at least one country')
        } 
        else if (this._markUp === undefined || this._markUp <= 0) {
            alert('Please enter a markup value in obie col.')
        } else {
            const fromCarrierList = this.buildFromCarrierListArr()
            const customerRateList = this.buildCustomerRateListArr()
            const bodyTemplateForCarrierList = {
                "rateMarkup": (this._markUp/100) + 1,
                "fromCarrierList": fromCarrierList,
                "customerRateList": customerRateList
            }
            const bodyTemplateForCustomerList = {
                "profile": bodyTemplateForCarrierList
            }
            this.postCarrierListToProfile(toCarrierId, toCarrierTier, bodyTemplateForCarrierList)
            this.postCarrierRatesInfoToProfile(toCarrierId, toCarrierTier, bodyTemplateForCustomerList)
        }
    }

    buildFromCarrierListArr = () => {
        const fromCarrierList = this._tableRowData
            .filter( eaCountry => eaCountry.hasOwnProperty('currentSelectedRatecard') )
            .map( eaCountry => {
                let carrierId: number
                let carrierTier: string
                const currentRatecard = eaCountry.currentSelectedRatecard[0]
                this._tableColDef.forEach( eaCol => {
                    if(eaCol.hasOwnProperty('field') && eaCol.field === currentRatecard) {
                        carrierId = eaCol.carrierId,
                        carrierTier = eaCol.tier
                    }
                })
                return {
                    "country_iso": eaCountry.code,
                    "fromCarrier": [
                        {
                            "fromCarrier_id": carrierId,
                            "rateCardTier": carrierTier
                        }
                    ]
                }
            })
        return fromCarrierList
    }

    buildCustomerRateListArr = (): Array<{country_iso: string, finalRate: number, minRate: number}> => {
        const customerRateList = this._tableRowData
            .filter( eaCountry => eaCountry.hasOwnProperty('currentSelectedRatecard') )
            .map( eaCountry => {
                let customRate: number = 0
                if (eaCountry.hasOwnProperty('customRate') && eaCountry.customRate > 0) {
                    customRate = eaCountry.customRate
                }
                return {
                    "country_iso": eaCountry.code,
                    "finalRate": customRate,
                    "minRate": 0 // !@@@ to be added at a later date
                }
            })
        return customerRateList
    }

    // ================================================================================
    // * Download as... for A2Billing
    // ================================================================================
    downloadForA2Billing = (fileType: string) => {
        if ( this._numberOfChecked <= 0) {
            alert('Please select at least one country')
        } 
        else if (this._markUp === undefined || this._markUp <= 0) {
            alert('Please enter a markup value in obie col.')
        }
        else {
            const A2BillingObj = JSON.parse(JSON.stringify(this._tableRowData)) // deep clone tableRowObj from parent
            const preppedJson = this.filterOutTableData(A2BillingObj)
            const applyCustom = this.applyCustomRate(preppedJson)
            const A2BillingFormatJson = this.processIntoA2BillingFormat(applyCustom)
            const csv = FilesUtils.jsonToCsv(A2BillingFormatJson, {header: false}, 
                ['prefix', 'destination', 'sell_rate', 'sell_rate_minimum', 'sell_rate_increment',
                'buy_rate', 'buy_rate_minimum', 'buy_rate_increment'])
            FilesUtils.saveAsFile(csv, `result.${fileType}`)
        }
    }

    filterOutTableData(A2BillingObj: Array<any>): any {
        const filteredDataIsChecked = A2BillingObj.filter( eaCountry => { // Filters on only the checked ratecard
            return eaCountry.hasOwnProperty('currentSelectedRatecard')
        })
        const preppedJson: Array<any> = filteredDataIsChecked.map( eaCountry => {
            const currentKey = eaCountry.currentSelectedRatecard[0]
            if(eaCountry.hasOwnProperty(`${currentKey}`) && eaCountry[currentKey].hasOwnProperty('rates')) {
                const relevantRates = eaCountry[currentKey].rates
                return eaCountry.hasOwnProperty('customRate') ? [eaCountry.customRate, relevantRates] : relevantRates
            }
        })
        return preppedJson
    }

    applyCustomRate(preppedJson) {
        // ? 3 possible scenarios 
            // ? undefined(if country not checked)
            // ? is an arr containing customRate and ratelist
            // ? is a normal set of rates, return this
        const customRateList = preppedJson
            .filter( eaCountry => eaCountry !== undefined)
            .map( eaCountry => {
                if (eaCountry.length === 2) {
                    eaCountry.forEach( eaPrefix => eaPrefix.sell_rate = eaCountry[0] )
                    eaCountry.shift()
                }
                return eaCountry
            })
        return customRateList.flat(2)
    }

    processIntoA2BillingFormat(preppedJson: Array<any>): Array<any> {
        return preppedJson.map( eaPrefix => {
            let sell_rate: number
            eaPrefix.hasOwnProperty('sell_rate') 
                ? sell_rate = RatecardUtils.convertDollarToCent(eaPrefix.sell_rate) 
                : sell_rate = RatecardUtils.convertDollarToCent(((eaPrefix.buy_rate * this._markUp) / 100) + eaPrefix.buy_rate)
            return {
                prefix: eaPrefix.prefix,
                destination: eaPrefix.destination,
                sell_rate: sell_rate,
                sell_rate_minimum: 1,
                sell_rate_increment: 1,
                buy_rate: RatecardUtils.convertDollarToCent(eaPrefix.buy_rate),
                buy_rate_minimum: 1,
                buy_rate_increment: 1
            }
        })
    }

    test() {
        console.log(this._tableRowData)
        console.log(this._tableColDef)
    }

    disabledIfNoChecked = (): void => {
        this._numberOfChecked <= 0 ? this.downloadAsDisabled = true : this.downloadAsDisabled = false
    }
}
