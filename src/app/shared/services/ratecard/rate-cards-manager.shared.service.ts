import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class RatecardsManagerSharedService {

    ratecardInfoJson = new BehaviorSubject({})
    currentRatecardInfoJson = this.ratecardInfoJson.asObservable()

    changeRatecardInfoJson(ratecardObj: object): void {
        this.ratecardInfoJson.next(ratecardObj)
    }

}