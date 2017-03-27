<?php
namespace dmirogin\js\urlmanager;

use Yii;
use yii\base\BootstrapInterface;
use yii\base\Object;
use yii\web\View;
use yii\helpers\Json;

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

        JsUrlManagerAsset::register(Yii::$app->view, [
            'enablePrettyUrl' => $app->urlManager->enablePrettyUrl,
            'rules' => $rules
        ]);
    }
}