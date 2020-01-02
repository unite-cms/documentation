# Getting started

unite cms is a decoupled content management system that allows you to manage all kind of content in one application. 
You can configure data schemas with any kind of data / user / setting types. Via the admin interface you and your 
content editors can manage content according to the defined types. unite cms does not provide any frontend rendering 
layer, so beside of the admin interface, the only way to access the content is via a GraphQL API.

## Installation

unite cms is a a set of Symfony bundles that can be added to any Symfony application. This is the default way to 
install and use unite cms with all core bundles, however you can also use only a subset of the core bundles or 
customize the installation steps:

```shell script
    # 1. Install new symfony application (version 4.4 or 5)
    symfony new unite

    cd unite

    # 2. Require all unite cms core bundles
    composer require unite-cms/unite-pack

    # 3. Generate ssh keys for JWT
    # Please see https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/index.md#generate-the-ssh-keys

    # 4. Add / modify env variables in .env.local
    # DATABASE_URL=mysql://user:password@127.0.0.1:3306/database
    # JWT_PASSPHRASE=passphrase
    # MAILER_FROM=noreply@example.com
    # MAILER_URL=smtp://127.0.0.1:1025

    # 5. Install & build assets for the admin interface
    # Add webpack.config.js from https://github.com/unite-cms/unite-cms/blob/master/webpack.config.js
    # Add assets from https://github.com/unite-cms/unite-cms/tree/master/assets
    yarn install
    yarn build    

    # 6. Create doctrine database schema
    bin/console doctrine:database:create
    bin/console doctrine:schema:update --force
``` 

## Hello World

Once, unite cms is installed, you can create your first domain by defining a GraphQL schema file in config/unite/default/schema.graphql:
````graphql
# Content / User Types
"""Demo Content"""
type DemoContent implements UniteContent {
    id: ID
    _meta: UniteContentMeta

    """Demo title"""
    title: String! @textField

    """Content"""
    content: String @textField(escape: false)
}


"""Administrators"""
type Admin implements UniteUser
@passwordAuthenticator(passwordField: "password")
@emailPasswordReset(emailField: "username", passwordField: "password")
@emailInvite(if: "%(IS_ADMIN)%", emailField: "username", passwordField: "password") {
    _meta: UniteContentMeta
    id: ID
    username: String! @emailField
    password: NULL @passwordField
}

# Admin fragments
fragment content on DemoContent @tableAdminView {
    title @adminField(inlineCreate: true)
    content @wysiwygAdminField
}

fragment admins on Admin @tableAdminView {
    username
}
```` 

Based on this schema you can now create your first admin user and login into unite cms: 

```shell script
    bin/console unite:schema:validate # Validate the schema
    bin/console unite:user:create # Create first admin user

    # Now you are ready to run the unite cms admin dev server and login with your admin user:
    symfony serve
```
