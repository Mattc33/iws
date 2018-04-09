import { Injectable } from '@angular/core';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Injectable()
export class NestedAgGridService {

    formatDataToNestedArr(input) {
        const splitName = splitNameStringByPound(input);
        const addFieldData = formJSONWithNewFields(input);
        const groupedData = groupDataByName(addFieldData);
        const formattedData = formNewJSONObj(groupedData);
        const finalData = insertObjInNestedChildrenArr(formattedData, groupedData);

        function splitNameStringByPound(json) {
            return json.map(data => data.name.split('#'));
        }

        function formJSONWithNewFields(json) {
            const splitNameFields = splitNameStringByPound(input);
            const insertNewFieldsArrPrivate = [];
            const insertNewFieldsArrTeleU = [];

            for (let i = 0; i < json.length; i++) {
                if ( splitNameFields[i][2] === 'private' ) {
                    insertNewFieldsArrPrivate.push(
                        {
                            ratecard_bundle: splitNameFields[i][0] + ': [Private]',
                            name: splitNameFields[i][0],
                            dateAdded: splitNameFields[i][1],
                            offer: splitNameFields[i][2],
                            country: splitNameFields[i][3],
                            id: json[i].id,
                            carrier_id: json[i].carrier_id,
                            carrier_name: json[i].carrier_name,
                            confirmed: json[i].confirmed,
                            active: json[i].active,
                            priority: 1
                        }
                    );
                }
                if ( splitNameFields[i][2] === 'teleU' ) {
                    insertNewFieldsArrTeleU.push(
                        {
                            ratecard_bundle: splitNameFields[i][0] + ': [TeleU]',
                            name: splitNameFields[i][0],
                            dateAdded: splitNameFields[i][1],
                            offer: splitNameFields[i][2],
                            country: splitNameFields[i][3],
                            id: json[i].id,
                            carrier_id: json[i].carrier_id,
                            carrier_name: json[i].carrier_name,
                            confirmed: json[i].confirmed,
                            active: json[i].active,
                            priority: 1
                        }
                    );
                } else {
                }
            }

            const combinedNewFieldsArr = insertNewFieldsArrPrivate.concat(insertNewFieldsArrTeleU);
            return combinedNewFieldsArr;
        }


        function groupDataByName(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };

            const data = json.groupBy('ratecard_bundle');
            const dataArr = [];
            for (const item in data) {
                if ( item ) {
                    dataArr.push(data[item]);
                } else {
                }
            }
            return dataArr;
        }

        function formNewJSONObj(groupDataByNameObj) {
            const formattedObj = [];
            for (let i = 0; i < groupDataByNameObj.length; i++) {
            formattedObj.push(
                {
                    ratecard_bundle: groupDataByNameObj[i][0].ratecard_bundle,
                    children: []
                }
            );
            }
            return formattedObj;
        }

        function insertObjInNestedChildrenArr(formattedData, groupedData) {
            for (let i = 0; i < formattedData.length; i++) {
                for (let x = 0; x < groupedData[i].length; x++) {
                    formattedData[i].children.push(
                    groupedData[i][x]
                    );
                }
            }
            return formattedData;
        }

        return finalData;
    }

}

