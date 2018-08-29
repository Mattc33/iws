import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ImporterSharedService {

    numberOfRatesInRatecard = new BehaviorSubject<number>(0)
    currentNumberOfRatesInRatecard = this.numberOfRatesInRatecard.asObservable()

    numberOfRatesInResponse = new BehaviorSubject<number>(0)
    currentNumberOfRatesInReponse = this.numberOfRatesInResponse.asObservable()

    ratesInResponse = new BehaviorSubject<[{}]>([{}])
    currentRatesInResponse = this.ratesInResponse.asObservable()

    changeNumberOfRatesInRatecard(rateNumber: number): void {
        this.numberOfRatesInRatecard.next(rateNumber)
        console.log(rateNumber)
    }

    changeNumberOfRatesInResponse(rateNumber: number): void {
        this.numberOfRatesInResponse.next(rateNumber)
        console.log(rateNumber)
    }

    changeRatesInResponse(ratesList: [{}]): void {
        this.ratesInResponse.next(ratesList)
        console.table(ratesList)
    }

}
