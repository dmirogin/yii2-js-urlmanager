<?php
namespace dmirogin\js\urlmanager;

use yii\helpers\Json;
use yii\web\AssetBundle;
use yii\web\View;

class JsUrlManagerAsset extends AssetBundle
{
    public $jsOptions = [
        'position' => View::POS_HEAD
    ];

    public $sourcePath = '@vendor/dmirogin/yii2-js-urlmanager/js/build/';

    public $js = [
        'bundle.js',
    ];
}