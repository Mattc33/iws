import { Injectable } from '@angular/core';

@Injectable()
export class MainTableCommonSharedService {

    // ! Utility functions for formatting ratecard resp into AG Grid format

    // * Returns the variance of the given Arr, takes an arr of nums
    returnVariance(array): any {
        const mean = array.reduce((acc, value) => (acc + value) / array.length);
        const diff = array.map( (num) => Math.pow(num - mean, 2));
        const variance = diff.reduce((acc, value) => (acc + value) / array.length);
        return variance;
    }

    // * Returns the mean of the given Arr, takes an arr of nums
    returnMean(array): any {
        const sum = array.reduce( (acc, value) => acc + value );
        const mean = (sum / array.length);
        return mean;
    }

    // * Returns the joined items of the given Arr, Takes arr of strings & seperator string
    joinStrings(array, seperator): any {
        const joinStrings = (arr) => {
            const join = array.reduce( (acc, value) => acc + ` ${seperator} ` + value );
            return join;
        };
        return joinStrings(array);
    }

    // * Filtering out nums out of the arr of objs and converting remaining valid strings to floats
    // * Remove the first number which is the prefix of the rate
    extractRates = function(array: any): any {
        const dataArr = [];
        const arr = Object.values(array.data);
        for ( let i = 0; i < arr.length; i++) {
            if ( arr[i] > 0 ) {
                dataArr.push( arr[i] as number * 1 );
            }
        }
        const ratesArr = dataArr.slice(1);
        return ratesArr;
    };

    // ! PreFilters on JSON Resp
    filterOutBlankArrays = (array) => 
        array.filter( arrItem => arrItem['rates'].length > 0 )

    filterByTeleU = (array) => array.filter( (arrItem) => {
        const type = arrItem.ratecard_name.split('#')[2];
        if (type === 'teleU') {
            return type;
        }
    })

    filterByTier = (array, filter: string) => array.filter( (arrItem) => {
        if ( arrItem.ratecard_tier === filter) {
            return arrItem.ratecard_tier;
        }
    })

    preFilter = (array, filter: string) => {
        const filterByTeleU = this.filterByTeleU(array);
        const filterByTier = this.filterByTier(filterByTeleU, filter);
        return this.filterOutBlankArrays(filterByTier);
    }



}
