# BASIC CONCEPTS

_Learn the basic architecture of unite cms and see how you can define your schema types._

<!-- ######################################## -->

## Symfony configuration
unite cms allows you to define the following symfony configurations. This configurations have good default values, so you probably won't need to change them: 

```
unite_cms_core:
    domain_config_dir: '%kernel.project_dir%/config/unite/'
    maximum_nesting_level: 8
```
<!-- ######################################## -->

## Organizations

Organizations in unite cms are the top level entities that contain all users and domains. On our SaaS platform, each subdomain belongs to one organization (your-org-name.unitecms.io). Multiple organizations are completely separate and will never share any informations. When you create an account on unitecms.io, you will be asked to create your first organization. You can always create new organizations or get invited to other organizations. One organization contains the following entities: 

### USER

Each user of an organization can login into this organization but cannot access any domains unless he_she is a member of the domain. Users can become organization admins. Organization admins can invite new users, assign the administration role to existing users, create api keys, create new domains and are allowed to access all domains.

Note: Because organization admins can bypass all security checks you should use an user account with organization admin privileges only for administrative tasks and use normal users for content editing.

### API KEY

Organization admins can create API keys. By using this keys, clients can access the GraphQL API. API keys can only access domains, they are members of. One API key can be member of multiple domains, which is especially necessary if you want to create a reference between different domains.

### DOMAIN

One organization can hold an unlimited number of domains, where all of the content management is happening.

<!-- ######################################## -->

## Domains

A domain in unite cms groups together related content and setting types.

An example of a domain could be "Website" and contains "Pages", "Page Settings" and "Blog Articles". Another example would be a "Employees" domain that contains a list of all employees and vacation planing.

Domains can have reference fields to other domains which allows you to create very powerful content structures.

Domain configuration is done by creating or updating its JSON configuration. Example of a very simple domain:

```JSON
{
    "identifier": "website",
    "title": "Website",
    "content_types": [
        {
            "title": "Pages",
            "identifier": "pages",
            "fields": [
              { "title": "Headline", "identifier": "headline", "type": "text" }
            ]
        }
    ]
}
```

This domain would provide one content type "Website" and no setting types. By default, each domain contains an **"Editor"** and **"Viewer"** member type. Editors have the permission to manage all content and settings, viewers can only read it.

For the website example, you could create an API key and add it as a Viewer Domain Member to the website domain. Now your website can do an GraphQL API request to the unite cms api endpoint of your domain and gets all page headlines to display them:

```graphql
# https://{YOUR-ORG}.unitecms.io/website/api?token={TOKEN}

query {
    findPages {
        result {
            headline
        }
    }
}
```

Each domain can define an infinit number of **content_types, setting_types** and at least one **domain_member_types**. For each of them you can define an infinit number of fields. Domains also contains the **permissions** config, which is configured to allow all members to view the domain but only the organization administrator to update the domain schema. To find out more about defining permissions in unite cms, see the topic Permissions.

<!-- ######################################## -->

## Content Types
Each new content type in unite cms comes with no fields and one view ("all") per default. By adding fields, you can define all kind of content schemas (for example news articles, web pages, invoices or products). By changing the settings of the "all" view or by adding additional views, you can define different management collections of you content. For example a content type "Webpages" could have a default view that allows sorting the content for displaying a navigation list and a second view that shows all pages that are marked for internal review. For more information about all available views, see chapter "Views".

To improve the UX for your content editors, you can set an optional icon from the icon set, unite cms is using [(Feather)](https://feathericons.com/).

```JSON
{
    ...

    "content_types": [
        {
            "title": "Webpages",
            "identifier": "pages",
            "icon": "file",
            "fields": [
              { "title": "Headline", "identifier": "headline", "type": "text" },
              { "title": "Needs review", "identifier": "needs_review", "type": "checkbox" },
              { "title": "Position", "identifier": "position", "type": "sortindex" }
            ]
        }
    ],
    "views": [
        {
           "title": "All",
           "identifier": "all",
           "type": "sortable",
           "settings": {
               "sort_field": "position"
           }
       },
       {
           "title": "Needs review",
           "identifier": "review",
           "type": "table",
           "settings": { "filter": { "field": "needs_review", "operator": "=", "value": "1" }
       }
    ]
}
```

For each content type you can define permissions, using a very powerful expression engine that is described in chapter "Permissions".

For each content type, the GraphQL API of your domain defines a **find{CONTENT_TYPE}** query object as well as an **create{CONTENT_TYPE}** and **update{CONTENT_TYPE}** mutation object. If you want to query content from multiple content types together, you can use the generic **find** query object.


```graphql
# https://{YOUR-ORG}.unitecms.io/website/api?token={TOKEN}

query {
 find(types: ["pages"]) {
   result {
     ... on PagesContent {
      headline
    }
   }
 }

 findPages(
    filter: { field: "needs_review", operator: "!=", value: "1" },
    sort: {field: "position", order: "ASC"}
  ) {
   result {
     headline
   }
 }
}
```

To learn more about the GraphQL API, see the chapter "GraphQL API" or use a client like GraphiQL to explore API of your domain.

<!-- ######################################## -->

## Setting Types
Setting types are very similar to content types, however in contrast to content types, there is exactly one setting instance for each setting type. Therefore there are no views and only a "view"  and an "update" permission, but no "create" and "delete".

```JSON
"setting_types": [
  {
     "title": "Frontpage",
     "identifier": "frontpage",
     "fields": [
       {
         "title": "Header content",
         "identifier": "header",
         "type": "wysiwyg",
         "description": "Enter an introduction text that will be shown next to the video",
         "settings": {
           "heading": ["p", "h1", "h2", "h3", "h4", "h5"]
         }
       }
     ]
  }
]
```

Like for content types, setting types can be queried using the GraphQL API (**Note**: Mutations are not implement yet for setting types):

```GraphQL
query {
  FrontpageSetting {
    header
  }
}
```

To learn more about the GraphQL API, see the chapter "GraphQL API" or use a client like GraphiQL to explore API of your domain.

<!-- ######################################## -->

## Domain member types

Each domain comes with two domain member types per default: "Viewer" and "Editor". You can modify or delete this types and add any number of types, however there must be at least one domain member type for each domain. 

Each API key and each CMS user of your organization must become a member of your domain in order to get access to it. So even if you set a content type read permission to "true" (= always grant access) for example, only members of the domain can actually see the content. 

Domain member types are similar to content types and can also define any number of fields. At the moment this fields can only be used to save content and inside a permission check expression, in the future we might implement an API endpoint to allow you to query and create members.

```JSON
"domain_member_types": [
   {
     "title": "Editor",
     "identifier": "editor",
     "domain_member_label": "{accessor}",
     "fields": []
   },
   {
     "title": "Viewer",
     "identifier": "viewer",
     "domain_member_label": "{accessor} {department}",
     "fields": [
         { "title": "Department", "identifier": "department", "type": "choice", "settings": {...} }
     ]
   }
 ]
```
The domain_member_label is used whenever a domain member needs to get displayed (for example the title on the member update screen). Per default it shows the name of the member accessor (API key name or user name).

<!-- ######################################## -->

## Defining Permissions

unite cms allows you to define permissions for accessing domains, content types and setting types by writing a short expression statement. This expression statement gets compiled and evaluated and must return true or false to allow or deny access.

We are using the Symfony ExpressionLanguage component, so you can use all common syntax elements like "==", "!=" and arithmetic operators (+, -, % etc.). For a full reference see the [Symfony ExpressionLanguage syntax docs.](https://symfony.com/doc/current/components/expression_language/syntax.html) 

Inside an expression you can access the current domain member object and for content and setting types the current **content** object:

```GraphQL
member: {
    type: "editor",
    accessor: {
        name: "User name or API key name",
        id: "XXX-YYY-ZZZ",
        type: "api_key"
    }
    data: { ... }
}

content: {
    locale: "en",
    data: { ... }
}
```
By using properties (and especially the data property that holds all of the defined fields) of this two objects you can define very powerful expressions to check permission for a user and a content object (or a domain). Here are some examples:

### Domain

```JSON
"permissions": {
    "view domain": "true",
    "update domain": "member.type == \"editor\" or member.data.can_edit_domains == true"
}
```


### Content Type / Setting Type

```JSON
"permissions": {
    "view content": "member.data.project_admin_for == content.project",
    "list content": "member.type == \"editor\" or member.accessor.type == \"api_key\"",
    "create content": "member.type == \"editor\"",
    "update content": "member.accessor.id == content.my_author_field",
    "delete content": "member.data.manager_since < content.date_of_receipt"
}
```

Since we are just checking the result of the expression, you can allow access for all domain members with **"true"** and deny for all members with **"false"**.

**Note:** Permission expressions are only used to check permission for domain members. So even if you define a **"true"** permission, only members of the current domain are allowed to access the resource. Therefore you cannot create an anonymous public API endpoint, that can be accessed without API Key, however if you want to deliver public webpages for example you can create an API Key that must not be absolutely private.

Organization admins are allowed to manage all domains and all content for their organizations, independently from defined permissions. Because of this, the default permissions for domains are: **view: "true"** and **update: "false"** which means that all domain members can view the domain but only organization admins are allowed to update them.

<!-- ######################################## -->

## Defining Webhooks
unite cms allows you to define webhooks for Content Types and Setting Types, which will be fired on different CRUD Actions.

The following Settings are provided:

**query** (mandatory):    qraphQL query to query the current Content- or Setting Type Object   this data will be sent as JSON format during the POST request   (string)

**url** (mandatory):    webhook URL, which the request will be sent to   (url)

**condition** (mandatory):      ExpressionLanguage to define on which condition the webhook is fired  the following events are provided:  Content type: create, update, delete  Setting Type: update  (string)

**authentication_header** (optional):    will be passed as HTTP header "Authorization" to secure the webhook   (string, default: null)

**check_ssl** (optional):    possibility to disable webhook ssl check (not recommended)   (boolean, default: true)

Content Type / Setting Type
```JSON
"webhooks": [    
  {
         "query": "query { type, id, text, longtext }",
         "url": "http://www.myfrontendapp.com/hooks/delete",
         "condition": "event == \"delete\""
  },
  {
         "query": "query {  text }",
         "url": "http://www.myfrontendapp.com/hooks/update",
         "condition": "event == \"update\"",
         "authentication_header": "79437f5edda13f9c0669b978dd7a9066dd2059f1"
  }
]
```

<!-- ######################################## -->

## Defining Previews

unite cms allows you to define a preview for each Content- or Setting Type.  This gives you the possibility to check how the Content- or Setting Type will look in your design. After a preview was defined, a preview window will appear right to the content update interface and will listen to your changes automatically.

The following Settings are provided:

**url** (mandatory):    your preview url   (url)

**query** (mandatory):    qraphQL query to query the current Content- or Setting Type Object   this data will be passed as GET parameters to your preview    (string)

Content Type / Setting Type

```JSON
"preview": {
  "url": "http://www.myfrontendapp.com/preview.php",
  "query": "query { firstname, lastname }"
}
```

For example in preview.php you can access the values the following way

```php
$data = json_decode($_GET['data']);
print $data->firstname;
print $data->lastname;
```

<!-- ######################################## -->

## Defining Validations
unite cms allows you to define validations for Content- or Setting Types.  This gives you the possibility to define fine grained validators for your fields.

### Not Empty
Starting with version 0.7, there is also a new **"not_empty"** field setting for most of the core field types. This setting tags the form field as required and adds a validation for this field: 

```JSON
{
    "title": "Headline", 
    "identifier": "headline",
    "settings": {
        "not_empty": true
    }
}
```

The "not_empty" setting is available for all unite cms core field types except: collection, checkbox, sortindex, state.

### Generic validations
The following Settings are provided:

**expression** (mandatory):    the expression which should be validated    check Symfony ExpressionLanguage syntax docs again   (string)

**message** (optional):    A error message which will be presented to the user in case the validation is thrown   (string default: a general message like 'Invalid value')

**path** (optional):   A Path where the message should appear.   In most cases this will be a field identifier like "firstname"   If no path is given the message will appear on the top of the form.   (string default: '')

**groups** (optional):    on which event the validation should run   (array, default: ['CREATE', 'UPDATE'])

Content Type / Setting Type

The following example shows a validator which prevents an empty firstname on content creation. A custom validation message is used and will be displayed underneath the firstname field.

```JSON
"validations": [    
  {
         "expression": "content.data.firstname != ''",
         "message": "This field firstname is required.",
         "path": "firstname",
         "groups": [
           "CREATE"
         ]
  }
]
```

<!-- ######################################## -->

## Multilingual
Per default, each new content and setting type comes without an location. However, unite cms allows you to define multiple locales per type by adding a "locales" entry: 

```JSON
{
    "content_types": [
        {
            "title": "Content Type",
            ...
            "locales": ["en", "de", "fr"]
        }
    ],
    "setting_types": [
        {
            "title": "Setting Type",
            ...
            "locales": ["en", "de"]
        }
    ]
}
```

Now you can select a locale per content (and setting) and reference translations of this content (or setting) via the content context menu.

Via the GraphQL API, you can use filter by "locale" like any other field on the content:

```GraphQL
query {
    findPages(filter: { field: "locale", operator: "=", value: "en" }) {
        ...
    }
}
```

And you can access the locale and one or multiple translations of your content / setting:

```GraphQL
query {
    findPages {
        result {
            locale,
            translations(locales: null) {
                id,
                locale,
                headline
            }
        }
    }
}
```

<!-- ######################################## -->

## GraphQL API
The heart of unite cms is its GraphQL API. It allows you to query and manipulate your content and settings. GraphQL APIs are very powerful and allows you to get exactly the fields you need from exactly the content items you want to query. If you are new to GraphQL you should read the [introduction from graphql.org](https://graphql.org/learn/) before you continue.

Each domain comes with its own API endpoint: # 
**https://{ORG}.unitecms.io/{DOMAIN}/api.** In order to access the api, you need to provide an authentication token from an API Key that is a member of the domain. You should always use the HTTP **Authentication head field** to send the token, but it is also possible to add a GET **token** query parameter to the API url. 

The unite cms API has the following structure, that you can easily explore using one of the GraphQL clients (for example [GraphiQL](https://github.com/graphql/graphiql)):

```GraphQL
query {  
 find {
   total
   page
   result { ... }
 }
 findPages {
   total
   page
   result { ... }
 }
 WebsiteSetting { ... }
}

mutation {
 createPage {
   ...
 }
 updatePage {
   ...
 },
 deletePage {
   ...
 }
}
```

You can use the generic find query object to get results from one or multiple content types. This also allows you to combine multiple content types in one query. In the following example, assumed that there is a "news" and an "events" content type, you would get the 5 newest content items from both types. With to separate find queries you would get the 5 newest news AND the 5 newest events.

```GraphQL
query {  
 find(
   types: ["news", "events"],
   limit: 5,
   sort:  { field: "created", order: "DESC" },
   filter: { field: "published", operator: "=", value:"1" }
 ) {
   total,
   result {
     id,
     type,
     created,
     updated,
     
     ... on NewsContent {
       headline
     }
     
     ... on EventsContent {
       location
     }
   }
 }
}
```

Beside the generic find query object, unite cms creates one find object for each content type ("news" => "findNews", "events" => "findEvents") that has the same filters and structure like find but no types argument. Use this objects to get content from a single content type:

```GraphQL
query {
  findEvents {
    result {
      id,
      location
    }
}
```

For each setting of your domain, there will be one setting query object ("website" => "WebsiteSetting") you can use to get the setting fields. 
**Note:** At the moment you can only read settings but not write them. This will be implemented in a future release!

```GraphQL
query {
  WebsiteSettings {
    title,
    description,
    footer_text
  }
}
```

The current version of the API (0.7.3) allows you to create update and delete content items: 

```GraphQL
mutation {
 createNews(data: { headline: "Hello World"}, persist: true) {
   id,
   headline
 }

 updateNews(id: "XXX-YYY-ZZZ", data: {headline: "Updated headline"}, persist: true) {
   id,
   headline
 }

 deleteNews(id: "XXX-YYY-ZZZ", persist: true) {
   id, deleted
 }
}
```

### Filtering

All query find objects allows you to reduce the result, using an optional filter input parameter. The filter input has the following basic structure: 

```GraphQL
filter: {
  field: "headline",
  operator: "LIKE",
  value: "%Hello%"
}
```

At the moment the following operators are supported: "=", "<>", "<", "<=", ">", ">=", "IS NULL", "IS NOT NULL", "LIKE". To combine multiple filters, you can create a nested input element using the **AND** or **OR** fields.

```GraphQL
filter: {
   AND: [
     { field: "published", operator: "=", value:"1"},
     {
       OR: [
         { field: "is_very_important", operator: "=", value:"
         { field: "created", operator: ">", value:"1530611415"}
       ]
     }
   ]
 }
```

### Pagination
All query find objects allows you to limit the result using a limit and page input field. To get the first 10 items, you could do: 

```GraphQL
find(limit: 10, page: 1) { ... }
```

To get the next 10 items, use the page parameter:

```GraphQL
find(limit: 10, page: 2) { ... }
```