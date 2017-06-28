import UrlManager from './UrlManager';

(<any>window).urlManager = new UrlManager({
    enablePrettyUrl: true,
    rules: []
});