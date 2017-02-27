import {UrlRule, IUrlParams} from '../src/UrlRule';
import 'mocha';
import { should } from 'chai';
const assert = should();

interface ITestRuleRun {
    it: string,
    name: string,
    route: string,
    params: IUrlParams,
    expected: string
}

describe('Rules', function() {
    var runs: ITestRuleRun[] = [
        {
            it: 'with pattern groups',
            name: "/foo/<id:(\\d+)>/bar/<type:(first|second)>",
            route : "/foo/bar",
            params : {
                id : 10,
                type : "first"
            },
            expected : "/foo/10/bar/first"
        },
        {
            it: 'without pattern groups',
            name: "/foobarurl",
            route : "/foo/bar",
            params : {},
            expected : "/foobarurl"
        },
    ];

    for (let run of runs) {
        it('should be corrected ' + run.it, function () {
            let urlRule = new UrlRule(run.name, run.route);
            assert.equal(run.expected, urlRule.createUrl(run.route, run.params));
        });
    }

});