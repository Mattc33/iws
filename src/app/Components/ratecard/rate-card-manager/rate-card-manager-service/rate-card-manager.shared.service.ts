import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class RatecardManagerSharedService {

    ratecardInfoJson = new BehaviorSubject({})
    currentRatecardInfoJson = this.ratecardInfoJson.asObservable()

    carrierId = new BehaviorSubject(null)
    currentCarrierId = this.carrierId.asObservable()

    tier = new BehaviorSubject(null)
    currentTier = this.tier.asObservable()

    // BehaviorSubject for CarrierId and tier

    changeRatecardInfoJson(ratecardObj: object): void {
        this.ratecardInfoJson.next(ratecardObj)
    }

    changeCarrierId(carrierId: number): void {
        this.carrierId.next(carrierId)
    }

    changeTier(tier: string): void {
        this.tier.next(tier)
    }

}