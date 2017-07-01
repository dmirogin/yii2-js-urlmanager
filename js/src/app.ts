import UrlManager from './UrlManager';

(<any>window).UrlManager = new UrlManager({
    enablePrettyUrl: true,
    rules: []
});