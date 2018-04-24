import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LCRSharedService {

    source_providerJson = new BehaviorSubject<Array<[{}]>>([]);
    current_providerJson = this.source_providerJson.asObservable();

    change_providerJson(trunkJson: Array<[{}]>) {
        this.source_providerJson.next(trunkJson);
    }

    get_rowDataWithProviderName(jsonToBeManipulated: any, providerData: any): Array<[{}]> {
        for ( let i = 0; i < jsonToBeManipulated.length; i++) {
            for ( let x = 0; x < providerData.length; x++ ) {
                if ( jsonToBeManipulated[i].provider_id === providerData[x].id) {
                    Object.assign(jsonToBeManipulated[i], {provider_name: providerData[x].name});
                }
            }
        }
        return jsonToBeManipulated;
    }
}
