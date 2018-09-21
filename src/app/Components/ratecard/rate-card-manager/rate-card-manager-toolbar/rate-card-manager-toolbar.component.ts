import { Component, OnInit, Output, EventEmitter }      from '@angular/core'
import { CarrierService }                               from '../../../../shared/api-services/carrier/carrier.api.service'
import { RatecardManagerService }                       from '../../../../shared/api-services/ratecard/rate-card-manager.api.service' 

import DateUtils                                        from '../../../../shared/utils/date/date.utils'

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
    selectedValues = {
        toCarrierValue: null,
        productTierValue: null,
        fromCarrierValue: null,
        fromCarrierRatecardValue: null
    }

    // * Select Disabled values
    selectDisabled = {
        productTierDisabled: true,
        fromCarrierDisabled: true,
        fromCarrierRatecardDisabled: true,
        addDataToTableDisabled: true
    }

    // * From Ratecard Obj
    fromRatecardObj: object

    constructor(
        private _carrierSerivce: CarrierService,
        private _ratecardManagerService: RatecardManagerService
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
                            const date: number = parseInt(split[1])
                            const displayDate = DateUtils.unixToLocalTime(date)    
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
    disabledSelectHandler = (currentSelectState: string, selectToToggleDisabled: string, selectToToggleDisabledArr: Array<string>, selectToNullArr: Array<string>): void => {
        if (this.selectedValues[currentSelectState]) {
            this.selectDisabled[`${selectToToggleDisabled}`] = false 
        } else {
            selectToToggleDisabledArr.forEach( eaUI => this.selectDisabled[eaUI] = true)
            selectToNullArr.forEach( eaUI => this.selectedValues[eaUI] = null)
        }
    }

    disabledSelectArr = (): Array<string> => Object.keys(this.selectDisabled)

    selectValuesArr = (): Array<string> => Object.keys(this.selectedValues)

    toCarrierChangeHandler = (): void => {
        const disabledArr = this.disabledSelectArr()
        const toNullValuesArr = this.selectValuesArr()
        this.disabledSelectHandler('toCarrierValue', 'productTierDisabled', disabledArr, toNullValuesArr)
        // filters out the carrier selected in toCarrier for from Carrier select
        this.fromCarrierOptions = this.toCarrierOptions.filter( carrier => carrier.id !== this.selectedValues.toCarrierValue )
    }

    productTierChangeHandler = (): void => {
        const disabledArr = this.disabledSelectArr().slice(1)
        const toNullValuesArr = this.selectValuesArr().slice(1)
        this.disabledSelectHandler('productTierValue', 'fromCarrierDisabled', disabledArr, toNullValuesArr)
        // trigger an event @ parent => load profile
    }

    fromCarrierChangeHandler = (): void => {
        const disabledArr = this.disabledSelectArr().slice(2)
        const toNullValuesArr = this.selectValuesArr().slice(2)
        this.disabledSelectHandler('fromCarrierValue', 'fromCarrierRatecardDisabled', disabledArr, toNullValuesArr)
        if (this.selectedValues.fromCarrierValue !== null ) {
            this.getRatecardsInCarriersByTier(parseInt(this.selectedValues.fromCarrierValue), this.selectedValues.productTierValue)
        }
    }

    fromCarrierRatecardChangeHandler = (e): void => {
        const ratecardInfo = this.fromRatecardObj[e]
        const disabledArr = this.disabledSelectArr().slice(3)
        const toNullValuesArr = this.selectValuesArr().slice(3)
        this.disabledSelectHandler('fromCarrierRatecardValue', 'addDataToTableDisabled', disabledArr, toNullValuesArr)
        // trigger an event @ parent => add a new column
        this.e_addRatecardData.emit(ratecardInfo)
    }

    addRatecardDataToTable(): void {
        this.e_addRatecardDataToTable.emit() // trigger an event @ parent => add to table
    }
}
