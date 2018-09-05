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
    e_addRatecardData = new EventEmitter<{}>()
    @Output() 
    e_addRatecardDataToTable = new EventEmitter()

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
    addDataToTableDisabled = true

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
    disabledSelectHandler = (currentSelectState: string, selectToToggleDisabled: string, selectToToggleDisabledArr: Array<string>): void => {
        (this[currentSelectState]) ? this[selectToToggleDisabled] = false : selectToToggleDisabledArr.forEach( eaUI => this[eaUI] = true)
    }

    toCarrierChangeHandler = (): void => {
        const disabledArr = ['productTierDisabled', 'fromCarrierDisabled', 'fromCarrierRatecardDisabled', 'addDataToTableDisabled']
        this.disabledSelectHandler('toCarrierValue', 'productTierDisabled', disabledArr)
        // affects from Carrier Selection filters out the carrier selected in toCarrier 
        this.fromCarrierOptions = this.toCarrierOptions.filter( carrier => carrier.id !== this.toCarrierValue )
    }

    productTierChangeHandler = (): void => {
        const disabledArr = ['fromCarrierDisabled', 'fromCarrierRatecardDisabled', 'addDataToTableDisabled']
        this.disabledSelectHandler('productTierValue', 'fromCarrierDisabled', disabledArr)
        // trigger an event @ parent => load profile
    }

    fromCarrierChangeHandler = (): void => {
        this.fromCarrierRatecardValue = ''
        const disabledArr = ['fromCarrierRatecardDisabled', 'addDataToTableDisabled']
        this.disabledSelectHandler('fromCarrierValue', 'fromCarrierRatecardDisabled', disabledArr)

        if (this.fromCarrierValue !== null ) {
            this.getRatecardsInCarriersByTier(parseInt(this.fromCarrierValue), this.productTierValue)
        }
    }

    fromCarrierRatecardChangeHandler = (e): void => {
        const ratecardInfo = this.fromRatecardObj[e]
        const disabledArr = ['addDataToTableDisabled']
        this.disabledSelectHandler('fromCarrierRatecardValue', 'addDataToTableDisabled', disabledArr)
        // trigger an event @ parent => add a new column
        this.e_addRatecardData.emit(ratecardInfo)
    }

    addRatecardDataToTable(): void {
        this.e_addRatecardDataToTable.emit() // trigger an event @ parent => add to table
    }
}
