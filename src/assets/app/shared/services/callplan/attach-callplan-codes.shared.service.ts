import { Injectable } from '@angular/core';

@Injectable()
export class CodesFormSharedService {
    provideStatus() {
        return [
            {value: 'available'},
            {value: 'unavailable'},
            {value: 'deleted'},
            {value: 'staged'},
            {value: 'pending'}
        ];
    }

    provideCallplanPlanType() {
        return [
            {name: 'Unlimited', value: 'UNLIMITED_CALL_PLAN'},
            {name: 'Pay As You Go', value: 'PAY_AS_YOU_GO_CALL_PLAN'},
            {name: 'Minutes', value: 'MINUTES_CALL_PLAN'}
        ];
    }

    provideActiveWhen() {
        return [
            {name: 'Activated Immediately', value: 'IMMEDIATELY'},
            {name: 'Activated on a successful call', value: 'SUCCESS_CALL'}
        ];
    }

    providePromotion() {
        return [
            {name: 'Yes', value: true},
            {name: 'No', value: false}
        ];
    }

    provideCodePlanTypes() {
        return [
            {code: 0, name: 'Pay as you go'},
            {code: 1, name: 'Unlimited plan'},
            {code: 2, name: 'Minute plan'},
            {code: 3, name: 'Money plan'}
        ];
    }

    providePriorityList() {
        return [
            {num: 1},
            {num: 2},
            {num: 3},
            {num: 4},
            {num: 5},
            {num: 6},
            {num: 7},
            {num: 8},
            {num: 9}
        ];
    }


}
