import UrlManager from './UrlManager';

let urlManager = new UrlManager();
urlManager.configure((<any>window).urlManagerConfig);
(<any>window).UrlManager = urlManager;