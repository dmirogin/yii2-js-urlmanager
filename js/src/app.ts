import UrlManager from './UrlManager';

(<any>window).UrlManager = new UrlManager();
if ((<any>document).urlManagerConfiguration !== undefined) {
    (<any>window).UrlManager.configure((<any>document).urlManagerConfiguration);
}