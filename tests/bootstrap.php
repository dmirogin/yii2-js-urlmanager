<?php
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'test');

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

new \yii\web\Application([
    'id' => 'unit',
    'basePath' => __DIR__,
    'components' => [
        'jsUrlManager' => [
            'class' => \dmirogin\js\urlmanager\JsUrlManager::class,
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'suffix' => '.html',
            'rules' => [
                '/' => '/site/index',
                '/add/<id:\d+>' => '/site/add',
                [
                    'pattern' => '/foo/<id:(\\d+)>/bar/<type:(first|second)>/',
                    'route' => '/foo/bar',
                    'suffix' => '/'
                ],
                [
                    'class' => \yii\web\GroupUrlRule::class,
                    'prefix' => 'admin',
                    'rules' => [
                        'login' => 'user/login',
                        'logout' => 'user/logout',
                        'dashboard' => 'default/dashboard',
                    ],
                ]
            ],
        ]
    ]
]);