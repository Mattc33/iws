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

    // * Remove Ratecards that do not have any rates inside
    filterOutBlankArrays = (array, innerArr) => 
        array.filter( arrItem => arrItem[innerArr].length > 0 );

}
