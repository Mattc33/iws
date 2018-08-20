
import { Component, OnInit, Output, EventEmitter } from '@angular/core'

import { CarrierService } from '../../../../shared/api-services/carrier/carrier.api.service'
import { RatecardManagerService } from '../../../../shared/api-services/ratecard/rate-card-manager.api.service' 
import { RatecardManagerUtils } from './../../../../shared/utils/ratecard/rate-card-manager.utils';

@Component({
    selector: 'app-rate-card-manager-toolbar',
    templateUrl: './rate-card-manager-toolbar.component.html',
    styleUrls: ['./rate-card-manager-toolbar.component.scss']
})
export class RateCardManagerToolbarComponent implements OnInit {

    @Output()
    e_addRatecardCol = new EventEmitter<{}>()

    // ! Top Toolbar
    // * Select Dropdown Option Values
    toCarrierOptions: Array<any>
    fromCarrierOptions: Array<any>
    productTierOptions: Array<any> = [
        {label: 'Standard', value: 'standard'},
        {label: 'Premium', value: 'premium'}
    ]
    fromCarrierRatecardOptions: Array<any>

    // * Selected Values
    toCarrierValue: string
    productTierValue: string
    fromCarrierValue: string
    fromCarrierRatecardValue: string

    // * From Ratecard Obj
    fromRatecardObj: object

    // * Select Disabled values
    productTierDisabled = true
    fromCarrierDisabled = true
    fromCarrierRatecardDisabled = true

    constructor(
        private _carrierSerivce: CarrierService,
        private _ratecardManagerService: RatecardManagerService,
        private _ratecardManagerUtils: RatecardManagerUtils
    ) { }

    ngOnInit() {
        this.getCarriers()
    }

    // ================================================================================
    // * Event Handlers from Top Toolbar
    // ================================================================================
    getCarriers = (): void => {
        this._carrierSerivce.get_carriers()
            .subscribe(
                toCarrierList => {
                    this.toCarrierOptions = toCarrierList
                    console.log(toCarrierList)
                },
                error => console.log(error)
            )
    }

    getRatecardsInCarriersByTier = (carrierId: number, tier: string): void => {
        this._ratecardManagerService.get_ratecardsInCarriersByTier(carrierId, tier)
            .subscribe(
                data => {
                    const fromCarrierList = data.ratecards
                    new Promise( (resolve, reject) => {
                        const remapped = fromCarrierList.map( eaCarrier => {
                            const split = eaCarrier.ratecard_name.split('#')
                            eaCarrier.groupId = `${split[0]}_${eaCarrier.add_ts}` 
                            eaCarrier.filter = split[2]
                            eaCarrier.country = split[3]
                            eaCarrier.carrierId = carrierId
                            return eaCarrier
                        }).filter( eaCarrier => eaCarrier.filter === 'private' )
                        resolve(remapped)
                    })
                    .then( (remapped: Array<any>) => {
                        return remapped.reduce( (acc, eaCarrier) => {
                            const key = eaCarrier.groupId
                            acc[key] = acc[key] || []
                            acc[key].push(eaCarrier)
                            return acc
                        }, {})
                    })
                    .then( reduced => {
                        const keysToArr = Object.keys(reduced).map( eaItem => {
                            const split = eaItem.split('_')
                            const displayDate = this._ratecardManagerUtils.unixToLocalTime(parseInt(split[1]))
                            return { id: eaItem, display: `${split[0]}: ${displayDate}` }
                        })
                        this.fromCarrierRatecardOptions = keysToArr
                        this.fromRatecardObj = reduced
                    })
                },
                error => console.log(error)
            ) 
    }

    // ================================================================================
    // * Event Handlers from Top Toolbar
    // ================================================================================
    disabledSelectHandler = (currentSelectState: string, selectToToggleDisabled: string): void => {
        (this[currentSelectState]) ?  this[selectToToggleDisabled] = false : this[selectToToggleDisabled] = true
    }

    // events
    toCarrierChangeHandler = (): void => {
        this.disabledSelectHandler('toCarrierValue', 'productTierDisabled')
        this.fromCarrierOptions = this.toCarrierOptions.filter( carrier => carrier.id !== this.toCarrierValue )
    }

    productTierChangeHandler = (): void => {
        
        this.disabledSelectHandler('productTierValue', 'fromCarrierDisabled')

        // trigger an event @ parent => load profile
    }

    fromCarrierChangeHandler = (): void => {
        this.fromCarrierRatecardValue = ''
        this.disabledSelectHandler('fromCarrierValue', 'fromCarrierRatecardDisabled')
        this.getRatecardsInCarriersByTier(parseInt(this.fromCarrierValue), this.productTierValue)
    }

    fromCarrierRatecardChangeHandler = (e): void => {
        const ratecardInfo = this.fromRatecardObj[e]
        console.log(ratecardInfo)
        // trigger an event @ parent => add a new column
        this.e_addRatecardCol.emit(ratecardInfo)
    }

    // ================================================================================
    // * Event Bubbling to Parent
    // ================================================================================
    loadProfile = (): void => {
        // success
            // parse json
            // convert it to a format AG Grid can use

        // fail
            // present a message saying http call failed
    }

}
