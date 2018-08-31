import { Component, OnInit } from '@angular/core'
import { RatecardManagerService } from './../../../../shared/api-services/ratecard/rate-card-manager.api.service'
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service'

@Component({
  selector: 'app-rate-card-manager-saveprofile',
  templateUrl: './rate-card-manager-saveprofile.component.html',
  styleUrls: ['./rate-card-manager-saveprofile.component.scss']
})
export class RateCardManagerSaveprofileComponent implements OnInit {

    constructor(
        private _ratecardManagerService: RatecardManagerService,
        private _snackbarSharedService: SnackbarSharedService
    ) { }

    ngOnInit() {

    }

    // ================================================================================
    // * Service
    // ================================================================================
    postCarrierListToProfile = (toCarrier_id: number, tier: string, body: Array<{}>): void  => {
        this._ratecardManagerService.post_carrierListToProfile(toCarrier_id, tier, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Edit Successful.', 2000)
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Edit failed.', 2000)
                }
            )
    }

    postCarrierRatesInfoToProfile = (toCarrier_id: number, tier: string, body: Array<{}>): void  => {
        this._ratecardManagerService.post_carrierRatesInfoToProfile(toCarrier_id, tier, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Edit Successful.', 2000)
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Edit failed.', 2000)
                }
            )
    }

    // ================================================================================
    // * Event Handlers from Parent Table
    // ================================================================================

    // ! Collect Data from Parent Component and Table

    // ? Where will I get Tier? This comes from the rate-card-manager-toolbar component
    // * I will need to do some sibling component data passing
    // * RXJS or NGRX

    // ? Where will I get toCarrier_id? This comes from the rate-card-manager-toolbar component
    // * I will need to do some sibling component data passing
    // * RXJS or NGRX

    // ? For postCarrierListToProfile()
    // * What does the body look like?
    /*
        {
            "rateMarkup": 0, 
            "fromCarrierList": [
                {
                    "country_iso": "string",
                    "fromCarrier": [
                        {
                            "fromCarrierId": 0,
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
    */
    //* How will I collect the necessary data to fill the fields of the JSON


    // ? For postCarrierRatesInfoToProfile()
    // * What does the body look like?
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
    //* How will I collect the necessary data to fill the fields of the JSON
}
