<?php
namespace dmirogin\js\urlmanager\assets;

use yii\helpers\Json;
use yii\web\AssetBundle;
use yii\web\View;

class JsUrlManager extends AssetBundle
{
    public $jsOptions = [
        'position' => View::POS_HEAD
    ];

    public $sourcePath = '@vendor/dmirogin/yii2-js-urlmanager/js/src/';

    public $js = [
        'UrlManager.js',
    ];

    public static function register($view, $config)
    {
        parent::register($view);
        $view->registerJs('document.jsUrlManager = new UrlManager(' . Json::encode($config) . ')', View::POS_HEAD);
    }
}