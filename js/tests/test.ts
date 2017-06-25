import test from 'ava';
import UrlManager from '../src/UrlManager';

let urlManager = new UrlManager({
    enablePrettyUrl: true,
    rules: [
        {
            name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
            route: '/foo/bar'
        }
    ]
});

test('it should create correct url which is contained parameters', t => {
    t.is('/foo/10/bar/first', urlManager.createUrl('/foo/bar', {
        id : 10,
        type : "first"
    }));
});