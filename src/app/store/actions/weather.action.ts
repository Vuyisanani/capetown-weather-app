import { Action } from '@ngrx/store';

export const CHANGE_TEMPERATURE_UNIT = "[PREFERENCE] CHANGE_TEMPERATURE_UNIT";
export const RETRYNOW = "[PREFERENCE] RETRY_NOW";
export const RESPONSELOADED = "[PREFERENCE] RESPONSE_LOADED";

export class ChangeTemperatureUnitAction implements Action {
    readonly type = CHANGE_TEMPERATURE_UNIT ;

    constructor(public payload: any) {}
}

export class RetryNowAction implements Action {
    readonly type = RETRYNOW ;

    constructor(public payload: any) {}
}

export class ResponseLoadedAction implements Action {
    readonly type = RESPONSELOADED ;

    constructor(public payload: any) {}
}

export type Actions =  RetryNowAction | ChangeTemperatureUnitAction | ResponseLoadedAction;