#  GETTING STARTED
_Getting started with unite cms, install unite cms using composer and basic configuration._

<!-- ######################################## -->

## A short introduction

unite cms is a decoupled content management system that allows you to manage all kind of content in one application. You can login into unite cms and configure any kind of data / user / settings types. Via the admin interface you and your content editors can manage content according to the defined types. unite cms does not provide any frontend rendering layer, so the only way to access the content is via a GraphQL API.

The big idea behind unite cms is to have a single system just for content management. All other features that are part of many state-of-the-art CMS but have nothing to do with content management (search server, image processing, template rendering etc.) are not part of unite cms and we are not planing to implement them in the future. Because of this, unite cms is designed to be integrated with other services.

One example would be to have a small website application, written in Symfony, that fetches content from unite cms and uses imgix.com for resizing images, that are stored in a S3 storage.

By focusing on content management only, we can put all our effort in the content management architecture and the content editor experience. Still, our SasS platform offers all features you would expect from a state-of-the-art CMS by integrating 3rd party open source services like minio.io.

<!-- ######################################## -->

## Installation

To use unite cms, you can sign up for free on [unitecms.io](https://profile.unitecms.io/registration). Our cloud, hosted in Vienna (Austria) always runs the latest version of unite cms and is monitored by our dev ops team. At the moment unitecms.io is in public beta and totally free. Starting with 2019, there will be one free plan and multiple  paid plans for higher usage limits (details will be provided soon). 

Since the application is published under an open source license, you can always run it on your own infrastructure. unite cms is based on Symfony 4 and vue.js, the only server dependencies are **PHP >= 7.1** and **MySQL >= 5.7.9**

Install PHP, MySQL and Composer according to your OS. Make sure your machine can run symfony 4 framework, everything is explained very well in the [symfony docs](https://symfony.com/doc/current/setup.html). You can use the PHP’s [built in webserver](https://symfony.com/doc/current/setup/built_in_web_server.html) or setup an [apache or nginx](https://symfony.com/doc/current/setup/web_server_configuration.html) webserver. Read the mod_php/PHP-CGI/PHP-FPM sections carefully!

### Installation for development

```bash
composer create-project unite-cms/standard unitecms --stability dev
cd unitecms
bin/console doctrine:schema:update --force

# run the development server
bin/console serve:run
```
On composer install (and update) you will be asked to set all required environment (dotenv) variables.

### Installation for production

```bash
composer create-project unite-cms/standard unitecms --stability dev --no-dev --no-scripts
cd unitecms

bin/console assets:install --env=prod
bin/console doctrine:schema:update --force --env=prod
bin/console cache:clear --env=prod
```

In order to run unite cms, all required settings must be available as environment variables. It is recommended to set this variables at a web server level.

After unite cms was successfully installed you can create a Platform Administrator and your first organization.
```bash
bin/console unite:user:create
bin/console unite:organization:create
```
Now you can login into unite cms and start using the cms.

See also our [medium tutorial](https://medium.com/unite-cms/how-to-setup-unite-cms-for-local-development-or-on-a-production-server-c1da99fa5c90)!

<!-- ######################################## -->

## Defining your structure

unite cms allows you to define your content structure by writing a single JSON document per domain. That means instead of an administration interface you will get an editor where you can define a schema for your content, webhooks, permissions etc.

Starting with version 0.7, for any custom installation of unite cms the domain configuration will (also) be saved to the filesystem and can be edited using any code editor. After changing a domain config in the filesystem, you can import the changes using the unite cms domain editor.

After you registered on unitecms.io you can add your first domain which brings you to the domain configuration screen. For a quick example, you can just copy the domain definition for a simple example blog. The only thing you need to do now is to enter s3 bucket information or to skip this, you can just delete the image field. 

### Variables: Reusable snippets
Domain definitions have a special property: variables. This property allows you to define reusable snippets in your domain configuration. This snippets will get replaced just before the JSON gets parsed and validated. For example you can save the toolbar settings for a wysiwyg editor in a variable and use it on multiple wysiwyg fields:

**VARIABLES**

```JSON
{
  "title": "This is my domain",
  "identifier": "this_is_my_domain",

  "variables": {
    "@wysiwyg_settings": {
      "heading": [
        "h2",
        "h3",
        "p"
      ]
    }
  },

  "content_types": [
    {
      ...,
      "fields": [
        {
          "title": "Content",
          "identifier": "content",
          "type": "wysiwyg",
          "settings": "@wysiwyg_settings"
        },
        {
          "title": "Footer",
          "identifier": "footer",
          "type": "wysiwyg",
          "settings": "@wysiwyg_settings"
        }
      ]
    }
  ]
}
```
You can save any kind of (valid) JSON structure inside a variable, not only settings. This way you can define reusable fields or permissions or anything else.

