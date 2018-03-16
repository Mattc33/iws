import { Injectable } from '@angular/core';

@Injectable()
export class NestedAgGridService {

    formatDataToNestedArr(data) {
        const addFieldData = addAdditionalFieldsToArr(data);
        const groupedData = groupDataByName(addFieldData);
        const formattedData = formNewJSONObj(groupedData);
        const finalData = insertObjInNestedChildrenArr(formattedData, groupedData);

        function addAdditionalFieldsToArr(data): object {
            const insertNewFieldsArr = [];
            for (let i = 0; i < data.length; i++) {
            const currentNameString = data[i].name;
            const splitPound = currentNameString.split('#');

            insertNewFieldsArr.push({
                ratecard_bundle: splitPound[0],
                name: splitPound[0],
                offer: splitPound[2],
                country: splitPound[3],
                id: data[i].id,
                carrier_id: data[i].carrier_id,
                carrier_name: data[i].carrier_name,
                confirmed: data[i].confirmed,
                active: data[i].active,
                priority: 1
            });
            }
            data = insertNewFieldsArr;
            // console.log(data);
            return data;
        }

        function groupDataByName(addFieldData) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };

            data = addFieldData.groupBy('name');
            const dataArr = [];

            for (const item in data) {
                if ( item ) {
                    dataArr.push(data[item]);
                } else {
                }
            }
            // console.log(dataArr);
            return dataArr;
        }

        function formNewJSONObj(groupedData) {
            const formattedObj = [];
            for (let i = 0; i < groupedData.length; i++) {
            formattedObj.push(
                {
                ratecard_bundle: groupedData[i][0].name,
                children: []
                }
            );
            }
            // console.log(formattedObj);
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
            // console.log(formattedData);
            return formattedData;
        }

        return finalData;
    }

}

