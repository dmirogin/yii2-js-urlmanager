<?php


class JsUrlManagerTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @return \yii\web\UrlManager
     */
    protected function mockUrlManager()
    {
        /** @var \yii\web\UrlManager $urlManager */
        $urlManager = Yii::createObject([
            'class' => \yii\web\UrlManager::class,
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
        ]);

        return $urlManager;
    }

    public function testGetRules()
    {
        $urlManager = $this->mockUrlManager();

        /** @var \dmirogin\js\urlmanager\JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::createObject(\dmirogin\js\urlmanager\JsUrlManager::class);
        $jsUrlManager->setUrlManager($urlManager);

        $this->assertEquals([
            [
                'name' => '/',
                'route' => 'site/index',
                'suffix' => null
            ],
            [
                'name' => '/add/<id:\d+>',
                'route' => 'site/add',
                'suffix' => null
            ],
            [
                'name' => '/foo/<id:(\\d+)>/bar/<type:(first|second)>/',
                'route' => 'foo/bar',
                'suffix' => '/'
            ]
        ], $jsUrlManager->getRules());
    }


}