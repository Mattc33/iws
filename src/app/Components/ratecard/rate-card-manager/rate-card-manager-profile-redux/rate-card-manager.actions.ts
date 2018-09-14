import { Action } from '@ngrx/store'

export const TOGGLE_RATECARDCELL_CHECKBOX = '[UPDATE] RatecardCellCheckbox'

export class ToggleRatecardCellCheckbox implements Action {
    readonly type = TOGGLE_RATECARDCELL_CHECKBOX
    constructor(public payload: boolean) {}
}

