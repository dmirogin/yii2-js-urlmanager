<?php
namespace dmirogin\js\urlmanager;


use Yii;
use yii\base\BootstrapInterface;
use yii\base\BaseObject;
use yii\helpers\Json;
use yii\base\Application;
use yii\web\JsExpression;
use yii\web\Request;
use yii\web\UrlManager;
use yii\web\UrlRule;
use yii\web\View;

/**
 * JsUrlManager allows you register a frontend UrlManager which almost is similar to yii\web\UrlManager
 * And provide configuration
 *
 * @author Dmitry Dorogin <dmirogin@ya.ru>
 */
class JsUrlManager extends BaseObject implements BootstrapInterface
{
    /**
     * The location to register configuration Frontend UrlManager string
     * @var int
     */
    public $configurationStringPosition = View::POS_HEAD;

    /**
     * Set configuration to document.urlManagerConfiguration
     * @var bool
     */
    public $configureThroughVariable = false;

    /**
     * Initialize configuration on AJAX requests
     * @var bool
     */
    public $configureOnAjaxRequests = true;

    /**
     * @var UrlManager
     */
    private $urlManager;

    /**
     * @inheritdoc
     */
    public function bootstrap($app)
    {
        $this->setUrlManager($app->urlManager);
        $configuration = $this->defineConfiguration();
        $enableConfiguration = !$app->request instanceof \yii\web\Request || !$app->request->getIsAjax() || $this->configureOnAjaxRequests;
        if ($enableConfiguration && $this->configureThroughVariable) {
            $this->configureFrontendUrlManagerThroughVariable($configuration);
        } elseif ($enableConfiguration) {
            $this->configureFrontendUrlManager($configuration);
        }

        self::registerAssets();
    }

    /**
     * Register necessary assets
     */
    public static function registerAssets()
    {
        JsUrlManagerAsset::register(Yii::$app->view);
    }

    /**
     * Define configuration based on yii\web\UrlManager's configuration
     * @return array
     */
    public function defineConfiguration()
    {
        return [
            'enablePrettyUrl' => $this->urlManager->enablePrettyUrl,
            'showScriptName' => $this->urlManager->showScriptName,
            'suffix' => $this->urlManager->suffix,
            'rules' => $this->getRules(),
            'prefix' => $this->getPrefix(),
        ];
    }

    /**
     * Get rules
     */
    public function getRules()
    {
        $rules = [];
        foreach ($this->urlManager->rules as $name => $rule) {
            if ($rule instanceof UrlRule) {
                $rules[] = [
                    'name' => $rule->name,
                    'route' => $rule->route,
                    'suffix' => $rule->suffix
                ];
            } else if (is_string($rule)) {
                $rules[] = [
                    'name' => $name,
                    'route' => $rule
                ];
            }
        }

        return $rules;
    }

    /**
     * Get url's prefix
     * @return string
     */
    public function getPrefix()
    {
        return $this->urlManager->showScriptName || !$this->urlManager->enablePrettyUrl ?
            $this->urlManager->getScriptUrl() : $this->urlManager->getBaseUrl();
    }

    /**
     * @return UrlManager
     */
    public function getUrlManager()
    {
        return $this->urlManager;
    }

    /**
     * @param UrlManager $urlManager
     */
    public function setUrlManager(UrlManager $urlManager)
    {
        $this->urlManager = $urlManager;
    }

    /**
     * Register js string that configure frontend UrlManager
     * @param array $configuration
     */
    protected function configureFrontendUrlManager(array $configuration)
    {
        Yii::$app->view->registerJs(
            'UrlManager.configure(' . $this->prepareForFrontend($configuration) . ');',
            $this->configurationStringPosition
        );
    }

    /**
     * Register js string that configure frontend UrlManager
     * @param array $configuration
     */
    protected function configureFrontendUrlManagerThroughVariable(array $configuration)
    {
        Yii::$app->view->registerJs(
            'document.urlManagerConfiguration = ' . $this->prepareForFrontend($configuration) . ';',
            $this->configurationStringPosition
        );
    }

    /**
     * Prepare any data to frontend
     * @param mixed $value
     * @return string
     */
    private function prepareForFrontend($value) {
        return (string) new JsExpression(Json::encode($value));
    }
}
