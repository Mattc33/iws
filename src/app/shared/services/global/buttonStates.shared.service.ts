import { Injectable } from '@angular/core';

@Injectable()
export class ToggleButtonStateService {

    toggleButtonStates = (gridSelectionStatus: number): boolean => 
        gridSelectionStatus > 0 ? false : true

}
