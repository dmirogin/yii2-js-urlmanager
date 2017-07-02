import test from 'ava';
import UrlManager from '../src/UrlManager';

let urlManager = new UrlManager();
urlManager.configure({
    enablePrettyUrl: true,
    showScriptName: false,
    rules: [
        {
            name: '/',
            route: '/site/index'
        },
        {
            name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
            route: '/foo/bar'
        }
    ]
});

test('it should create correct url which is contained parameters', t => {
    t.is('/foo/10/bar/first', urlManager.createUrl('foo/bar', {
        id : 10,
        type : "first"
    }));
    t.is('/foo/10/bar/first', urlManager.createUrl('/foo/bar', {
        id : 10,
        type : "first"
    }));
});

test('it should create correct url without parameters', t => {
    t.is('/', urlManager.createUrl('/site/index'));
});

test('it should create correct url with query string if passed parameters aren\'t contained in name', t => {
    t.is('/?foo=bar&param2=value2', urlManager.createUrl('/site/index', {
        'foo' : 'bar',
        'param2' : 'value2'
    }));
});

test('it should create correct url with query string if not all passed parameters contained in name', t => {
    t.is('/foo/bar?id=7&param2=value2', urlManager.createUrl('/foo/bar', {
        'id' : 7,
        'param2' : 'value2'
    }));
});

test('it should create url if route doesn\'t found', t => {
    t.is('/undefined-url/foo/bar', urlManager.createUrl('/undefined-url/foo/bar'));

    t.is('/undefined-url/foo/bar?param1=value1&param2=value2', urlManager.createUrl('/undefined-url/foo/bar', {
        'param1' : 'value1',
        'param2' : 'value2'
    }));
});

test('it should create url if enablePrettyUrl is false', t => {
    urlManager.configure({
        enablePrettyUrl: false,
        rules: [
            {
                name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
                route: '/foo/bar'
            }
        ]
    });
    t.is('/index.php?r=foo%2Fbar&id=10&type=first', urlManager.createUrl('/foo/bar', {
        'id' : 10,
        'type' : 'first'
    }));
});

test('it should create url if showScriptName is true', t => {
    urlManager.configure({
        enablePrettyUrl: true,
        showScriptName: true,
        rules: [
            {
                name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
                route: '/foo/bar'
            }
        ]
    });
    t.is('/index.php/foo/10/bar/first', urlManager.createUrl('/foo/bar', {
        'id' : 10,
        'type' : 'first'
    }));
});