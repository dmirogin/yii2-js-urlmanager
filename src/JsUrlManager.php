<?php
namespace dmirogin\js\urlmanager;


use Yii;
use yii\base\BootstrapInterface;
use yii\base\Object;
use yii\helpers\Json;
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

        JsUrlManagerAsset::register(Yii::$app->view);

        $config = [
            'enablePrettyUrl' => $app->urlManager->enablePrettyUrl,
            'rules' => $rules
        ];

        Yii::$app->view->registerJs('document.jsUrlManagerConfig = new UrlManager(' . Json::encode($config) . ')', View::POS_HEAD);
    }
}