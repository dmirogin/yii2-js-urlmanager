[![Latest Stable Version](https://poser.pugx.org/dmirogin/yii2-js-urlmanager/v/stable)](https://packagist.org/packages/dmirogin/yii2-js-urlmanager)
[![License](https://poser.pugx.org/dmirogin/yii2-js-urlmanager/license)](https://packagist.org/packages/dmirogin/yii2-js-urlmanager)
# Yii2 js UrlManager

That extension provide a way to create urls from your frontend part.

### Instalation
```php
composer require dmirogin/yii2-js-urlmanager
```

1. [How to use](#how-to-use)
2. [PHP options](#php-options)
3. [Contributing](#contributing)
4. [Roadmap](#roadmap)

### <a name="how-to-use"></a> How to use

1. Add component to your application configuration
    ```php
    'jsUrlManager' => [
        'class' => \dmirogin\js\urlmanager\JsUrlManager::class,
    ],
    ```
2. Add component to bootstrap 
    ```php
    'bootstrap' => ['jsUrlManager'],
    ```
3. Now you can use window.UrlManager or just UrlManager in your frontend part
    ```js
       UrlManager.createUrl('foo/bar', {id: 10})
    ```

if you want to change assets position, use this
```php
'assetManager' => [
    'bundles' => [
        \dmirogin\js\urlmanager\JsUrlManagerAsset::class => [
            'jsOptions' => [
                'position' => \yii\web\View::POS_END,
            ],
        ],
    ],
],
```
### <a name="php-options"></a> PHP options

#### configurationStringPosition - integer
Default value - \yii\web\View::POS_HEAD

The location to register configuration Frontend UrlManager string
```php
'jsUrlManager' => [
    'class' => \dmirogin\js\urlmanager\JsUrlManager::class,
    'configurationStringPosition' => \yii\web\View::POS_END,
],
```

#### configureThroughVariable - boolean
Default value - false

Setting configuration through document variable urlManagerConfiguration
```php
'jsUrlManager' => [
    'class' => \dmirogin\js\urlmanager\JsUrlManager::class,
    'configureThroughVariable' => true,
],
```
### <a name="contributing"></a> Contributing
1. Clone project
2. Write code
3. Test
    ```
    npm run test
    ```
    ```
    ./vendor/bin/phpunit
    ```
4. Build js
    ```
        npm run build
    ```

### <a name="roadmap"></a> Roadmap
* Disable or enable including rules in frontend
* Creating absolute urls
