<?php
namespace dmirogin\js\urlmanager;


use Yii;
use yii\base\BootstrapInterface;
use yii\base\Object;
use yii\helpers\Json;
use yii\base\Application;
use yii\web\JsExpression;
use yii\web\UrlRule;
use yii\web\View;

/**
 * JsUrlManager allows you register a frontend UrlManager which almost is similar to yii\web\UrlManager
 * And provide configuration
 */
class JsUrlManager extends Object implements BootstrapInterface
{
    /**
     * @inheritdoc
     */
    public function bootstrap($app)
    {
        $configuration = $this->defineConfiguration($app);
        $this->configureFrontendUrlManager($configuration);
        $this->registerAssets();
    }

    /**
     * Register necessary assets
     */
    public function registerAssets()
    {
        JsUrlManagerAsset::register(Yii::$app->view);
    }

    /**
     * Define configuration based on yii\web\UrlManager's configuration
     * @param Application $app
     * @return array
     */
    public function defineConfiguration(Application $app)
    {
        $rules = [];
        foreach ($app->urlManager->rules as $name => $rule) {
            if ($rule instanceof UrlRule) {
                $rules[] = [
                    'name' => $rule->name,
                    'route' => $rule->route
                ];
            } else if (is_string($rule)) {
                $rules[] = [
                    'name' => $name,
                    'route' => $rule
                ];
            }

        }

        return [
            'enablePrettyUrl' => $app->urlManager->enablePrettyUrl,
            'rules' => $rules
        ];
    }

    /**
     * Register js string that configure frontend UrlManager
     * @param array $configuration
     */
    protected function configureFrontendUrlManager(array $configuration)
    {
        Yii::$app->view->registerJs(
            'UrlManager.configure(' . new JsExpression(Json::encode($configuration)) . ');',
            View::POS_HEAD
        );
    }
}