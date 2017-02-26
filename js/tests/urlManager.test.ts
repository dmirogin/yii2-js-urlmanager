import {UrlManager} from '../urlManager';
import {Assert} from 'chai';

const assert = Chai.Assert;

describe('Rules', function() {
    let urlManager = new UrlManager([
        {
            name : "/foo/<id:(\\d+)>/bar/<type:(first|second)>",
            route : "/foo/bar"
        },
    ]);

    it('should be corrected with params', function() {
        let rule = urlManager.createUrl('/foo/bar', {
            id : 7,
            type : "first"
        });
        assert.equal('/foo/7/bar/first', rule);
    });
});