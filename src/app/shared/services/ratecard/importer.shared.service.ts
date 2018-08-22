import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ImporterSharedService {

    numberOfRatesInRatecard = new BehaviorSubject<number>(0)
    currentNumberOfRatesInRatecard = this.numberOfRatesInRatecard.asObservable()

    numberOfRatesInResponse = new BehaviorSubject<Array<[{}]>>([])
    currentNumberOfRatesInReponse = this.numberOfRatesInResponse.asObservable()

    changeNumberOfRatesInRatecard(rateNumber: number): void {
        this.numberOfRatesInRatecard.next(rateNumber)
    }

}
