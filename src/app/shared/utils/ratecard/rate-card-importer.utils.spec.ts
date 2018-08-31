import { RatecardImporterUtils } from './rate-card-importer.utils'

const _ratecardImporterUtils = new RatecardImporterUtils

describe('RatecardImporterUtils', () => {

    it('should return as number', () => {
        expect(_ratecardImporterUtils.dateToEpoch('09/01/2018')).toEqual(jasmine.any(Number))
    })

})