import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import * as fromWeather from '../reducers/weather.reducer';

@Injectable()
export class FieldEffects {
    constructor(
        private store: Store<fromWeather.State>,
        private actions: Actions
          ) {}
    }