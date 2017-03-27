<?php
namespace dmirogin\js\urlmanager;

use yii\helpers\Json;
use yii\web\AssetBundle;
use yii\web\View;
use yii\web\YiiAsset;

class JsUrlManagerAsset extends AssetBundle
{
    public $jsOptions = [
        'position' => View::POS_HEAD
    ];

    public $sourcePath = '@vendor/dmirogin/yii2-js-urlmanager/js/src/';

    public $js = [
        'UrlManager.js',
    ];

    public $depends = [
        YiiAsset::class,
    ];

    public static function register($view, $config)
    {
        parent::register($view);
        $view->registerJs('document.jsUrlManager = new UrlManager(' . Json::encode($config) . ')', View::POS_HEAD);
    }
}