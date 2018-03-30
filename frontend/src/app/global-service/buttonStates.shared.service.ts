import { Injectable } from '@angular/core';

@Injectable()
export class ToggleButtonStateService {

    toggleButtonStates( gridSelectionStatus: number ): boolean {
        let buttonToggleBoolean: boolean;
        if ( gridSelectionStatus > 0 ) {
          buttonToggleBoolean = false;
        } else {
          buttonToggleBoolean = true;
        }
        return buttonToggleBoolean;
    }

}
