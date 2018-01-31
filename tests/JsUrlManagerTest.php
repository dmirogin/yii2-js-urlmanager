<?php


use dmirogin\js\urlmanager\JsUrlManager;
use yii\helpers\Json;
use yii\web\Application;
use yii\web\JsExpression;
use yii\web\Request;
use yii\web\UrlManager;
use yii\web\View;

class JsUrlManagerTest extends \PHPUnit\Framework\TestCase
{
    protected $urlManagerConfiguration = [
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
    ];

    protected function mockWebApplication()
    {
        return new Application([
            'id' => 'testing',
            'basePath' => dirname(__DIR__),
            'components' => [
                'urlManager' => $this->urlManagerConfiguration,
            ]
        ]);
    }

    /**
     * @return \yii\web\UrlManager
     */
    protected function mockUrlManager()
    {
        /** @var \yii\web\UrlManager $urlManager */
        $urlManager = Yii::createObject($this->urlManagerConfiguration);

        return $urlManager;
    }

    /**
     * @covers JsUrlManager::getUrlManager()
     * @covers JsUrlManager::setUrlManager()
     */
    public function testSetUrlManager()
    {
        $urlManager = $this->mockUrlManager();

        /** @var JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::createObject(JsUrlManager::class);

        $this->assertInstanceOf(JsUrlManager::class, $jsUrlManager);
        $this->assertNull($jsUrlManager->getUrlManager());

        $jsUrlManager->setUrlManager($urlManager);

        $this->assertInstanceOf(UrlManager::class, $jsUrlManager->getUrlManager());
    }

    /**
     * @covers JsUrlManager::getRules()
     * @depends testSetUrlManager
     */
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

    /**
     * @covers JsUrlManager::getPrefix()
     * @depends testSetUrlManager
     */
    public function testGetPrefix()
    {
        $urlManager = $this->mockUrlManager();

        /** @var JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::createObject(JsUrlManager::class);
        $jsUrlManager->setUrlManager($urlManager);

        $urlManager->showScriptName = true;
        $urlManager->enablePrettyUrl = true;

        $this->assertEquals($urlManager->getScriptUrl(), $jsUrlManager->getPrefix());

        $urlManager->showScriptName = false;
        $urlManager->enablePrettyUrl = false;

        $this->assertEquals($urlManager->getScriptUrl(), $jsUrlManager->getPrefix());

        $urlManager->showScriptName = false;
        $urlManager->enablePrettyUrl = true;

        $this->assertEquals($urlManager->getBaseUrl(), $jsUrlManager->getPrefix());
    }

    /**
     * @covers JsUrlManager::defineConfiguration()
     * @depends testSetUrlManager
     * @depends testGetRules
     * @depends testGetPrefix
     */
    public function testDefineConfiguration()
    {
        $urlManager = $this->mockUrlManager();

        /** @var JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::createObject(JsUrlManager::class);
        $jsUrlManager->setUrlManager($urlManager);

        $this->assertEquals([
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'suffix' => '.html',
            'rules' => $jsUrlManager->getRules(),
            'prefix' => $jsUrlManager->getPrefix(),
        ], $jsUrlManager->defineConfiguration());
    }

    /**
     * @covers JsUrlManager::bootstrap()
     * @depends testGetRules
     * @depends testGetPrefix
     * @depends testSetUrlManager
     * @depends testDefineConfiguration
     */
    public function testBootstrap()
    {
        $app = $this->mockWebApplication();

        $configureRequest = function($isAjax) use ($app) {
            $request = $this->createMock(Request::class);

            $request->expects($this->any())
                ->method('getIsAjax')
                ->willReturn($isAjax);

            $app->set('request', $request);
        };

        $configureViewWithRegisterJs = function($js, $pos = View::POS_BEGIN) use ($app) {
            $view = $this->createMock(View::class);

            $view->expects($this->once())
                ->method('registerJs')
                ->with($js, $pos);

            $app->set('view', $view);
        };

        /** @var JsUrlManager $jsUrlManager */
        $jsUrlManager = Yii::createObject(JsUrlManager::class);
        $jsUrlManager->setUrlManager($app->urlManager);
        $jsUrlManager->configurationStringPosition = View::POS_BEGIN;

        // Disable AJAX mode
        $jsUrlManager->configureOnAjaxRequests = false;
        $configureRequest(false);

        $configureViewWithRegisterJs('document.urlManagerConfiguration = ' . new JsExpression(Json::encode($jsUrlManager->defineConfiguration())) . ';');
        $jsUrlManager->configureThroughVariable = true;
        $jsUrlManager->bootstrap($app);

        $configureViewWithRegisterJs('UrlManager.configure(' . new JsExpression(Json::encode($jsUrlManager->defineConfiguration())) . ');');
        $jsUrlManager->configureThroughVariable = false;
        $jsUrlManager->bootstrap($app);

        // enable AJAX mode
        $jsUrlManager->configureOnAjaxRequests = true;
        $configureRequest(true);

        $configureViewWithRegisterJs('document.urlManagerConfiguration = ' . new JsExpression(Json::encode($jsUrlManager->defineConfiguration())) . ';');
        $jsUrlManager->configureThroughVariable = true;
        $jsUrlManager->bootstrap($app);

        $configureViewWithRegisterJs('UrlManager.configure(' . new JsExpression(Json::encode($jsUrlManager->defineConfiguration())) . ');');
        $jsUrlManager->configureThroughVariable = false;
        $jsUrlManager->bootstrap($app);

        // disable bootstrapping using AJAX requests
        $jsUrlManager->configureOnAjaxRequests = false;
        $jsUrlManager->configureThroughVariable = true;
        $jsUrlManager->bootstrap($app);
        $jsUrlManager->configureThroughVariable = false;
        $jsUrlManager->bootstrap($app);
    }
}
