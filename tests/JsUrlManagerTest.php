<?php


class JsUrlManagerTest extends \PHPUnit\Framework\TestCase
{
    public function testDefineConfiguration()
    {
        /** @var \dmirogin\js\urlmanager\JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::$app->jsUrlManager;
        $this->assertEquals([
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'suffix' => '.html',
            'rules' => [
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
            ]
        ], $jsUrlManager->defineConfiguration(Yii::$app->urlManager));
    }
}