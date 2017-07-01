<?php
namespace dmirogin\js\urlmanager;


use Yii;
use yii\base\BootstrapInterface;
use yii\base\Object;
use yii\helpers\Json;
use yii\web\JsExpression;
use yii\web\View;

class JsUrlManager extends Object implements BootstrapInterface
{
    public function bootstrap($app)
    {
        $rules = [];
        foreach ($app->urlManager->rules as $rule) {
            $rules[] = [
                'name' => $rule->name,
                'route' => $rule->route
            ];
        }

        $config = [
            'enablePrettyUrl' => $app->urlManager->enablePrettyUrl,
            'rules' => $rules
        ];

        Yii::$app->view->registerJs('window.urlManagerConfig = ' . new JsExpression(Json::encode($config)), View::POS_HEAD);

        JsUrlManagerAsset::register(Yii::$app->view);
    }
}