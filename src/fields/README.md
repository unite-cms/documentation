# Fields

_A reference of all fields that are part of unite cms core. You can use this fields for **content types**, **setting types** and **domain member types**._

<!-- ######################################## -->

## General information

The basic structure of each field in unite cms looks like this: 

```JSON
{
  "title": "My field",
  "identifier": "my_field",
  "type": "text",
  "settings": {}
}
```

Depending on the field type there are different settings allowed and required. For example a choice field type needs a choices setting with all allowed possible values for the dropdown. In this chapter you will find information and examples for each field type in unite with all possible settings.

### Common settings
All field types allow to define at least the optional **"description"** setting which is just a text and will be rendered below the field.

All (core) field types except collection, checkbox, sortindex and state also allow to define a **"not_empty"**  option which will make this field required (and also add validation). 

All (core) field types except collection, reference, sortindex, state and also allow to define a **"default"** option. The content of "default" will be used as a field value when you create a new content / setting object and can be changed by the user. 
**Note:** Depending on the field type, the default option excepts a string or a nested structure: 

```JSON
"fields": [
  {
    ...,
    "type": "choice", 
    "default": "blue"
  },
  {
    ...,
    "type": "choices",
    "default": ["yellow", "blue"]
  }
]
```

<!-- ######################################## -->

## Checkbox
A checkbox field that can be **true** or **false**. This field type has no configureable settings.

```JSON
{
    ...,
    "type": "checkbox"
}
```

<!-- ######################################## -->

## Choice
A choice field type that allows to select on value of a predefined set of values using a HTML select element. A **"choices"** setting is required.

```JSON
{
    ..., 
    "type": "choice",
    "settings": {
        "choices": {
            "Red color": "red",
            "Green color": "green",
            "Blue color": "blue"
        }
    }
}
```

<!-- ######################################## -->

## Choices
A choices field type that allows to select multiple values of a predefined set of values using a HTML select element. A "choices" setting is required.

```JSON
{
 ...
 "type": "choices",
 "settings": {
   "choices": {
     "Monday": 1,
     "Tuesday": 2,
     "Wednesday": 3,
     "Thursday": 4,
     "Friday": 5,
     "Saturday": 6,
     "Sunday": 7
   }
 }
}
```

<!-- ######################################## -->

## Date
Renders a HTML5 date input element. This field has no settings.

```JSON
{
    ...,
    "type": "date"
}
```

<!-- ######################################## -->

## DateTime
Renders a HTML5 date-time input element. This field has no settings.


```JSON
{
    ...,
    "type": "datetime"
}
```

<!-- ######################################## -->

## Email
Renders a HTML5 email input element. Input will be validated to be a valid email address. This field has no settings.


```JSON
{
    ...,
    "type": "email"
}
```

<!-- ######################################## -->

## Integer
Renders an input element that accepts integer numbers. This field has no settings.


```JSON
{
    ...,
    "type": "integer"
}
```

<!-- ######################################## -->

## Number
Renders an input element that accepts any numeric input. This field has no settings.


```JSON
{
    ...,
    "type": "number"
}
```

<!-- ######################################## -->

## Phone
Renders a HTML 5 tel input element. Note: The phone field does not validate any input. This field has no settings.

```JSON
{
    ...,
    "type": "phone"
}
```

<!-- ######################################## -->

## Range
Renders a slider input element that allows to select one value between **min** and **max**. The default settings are:

```JSON
{
    ...,
    "type": "range",
    "settings": {
        "min": "0",
        "max": "100",
        "step": "1"
    }
}
```

<!-- ######################################## -->

## Reference
This field holds a reference to a content element. The content element can be of this or any other domain in this organization. **Note:** Make sure, that the content editor is allowed to access the referenced domain and content type, otherwise he_she will not be able to fill out this field.

```JSON
{
    "title": "Related page",
    "identifier": "related_page",
    "type": "reference",
    "settings": {
        "domain": "website",
        "content_type": "page",
        "view": "all",
        "content_label": "{headline}"
    }
}
```

When using the GraphQL API, referenced content will be resolved automatically allowing you to select nested fields of the referenced content:

```GraphQL
{
    query {
        findCategories {
            result {
                related_page {
                    headline
                }
            }
        }
    }
}
```

The **domain** and **content_type** settings are required, **view** defaults to all, if content_label is left empty, "content type #{id}" will be used.

<!-- ######################################## -->

## Reference of
This field holds no data, but allows to access content that references this content element.

```JSON
{
    "title": "Similar Pages",
    "identifier": "similar_pages",
    "type": "reference_of",
    "settings": {
        "domain": "website",
        "content_type": "page",
        "reference_field": "related_page"
    }
}
```

When using the GraphQL API, reference_of is the same object as the query find{ContentType} object:

```GraphQL
{
    query {
        findPages {
            result {
                similar_pages(filter: ..., limit: ..., sort: ...) {
                    total,
                    page,
                    result {
                        id
                    }
                }
            }
        }
    }
}
```

<!-- ######################################## -->

## Sort Index
A sort index is a special field that stores an inter value (the sort index) and makes sure that all sort indexes of this content type are in sync if a new content item was added or removed and when a sort index was updated. 


```JSON
{
    ...,
    "type": "sortindex"
}
```

For example you have the following pages: 


```JSON
[
  { title: "Start", sort_index: 0},
  { title: "About us", sort_index: 1},
  { title: "Contact", sort_index: 2}
]
```

Now, if you remove the "About us" page, the sort indexes will automatically be updated:

```JSON
[
  { title: "Start", sort_index: 0},
  { title: "Contact", sort_index: 1}
]
```

Sort indexes are needed if you want to have a sortable view, however you can also use them for other purposes.

<!-- ######################################## -->

## Textarea
Renders a multi-row textarea. Allows you to set an optional rows setting to configure the textarea HTML rows attribute.

```JSON
{
    "type": "textarea",
    "settings": {
        "rows": 2
    }
}
```

<!-- ######################################## -->

## Text
Renders a text input field.

```JSON
{
    "type": "text"
}
```

<!-- ######################################## -->

## Collection
Collection fields allow you to create a repeatable container of one or multiple subfields. They can be used to allow multiple values for one field or to create complex content structures.

The following example would create an input element that allows to add 1-5 tags (min_rows and max_rows are optional).

```JSON
{
  "title": "Tags",
  "identifier": "tags",
  "type": "collection",
  "settings": {
    "min_rows": "1",
    "max_rows": "5",
    "fields": [
      { "type": "text", "identifier": "name", "title": "Name" }
    ]
  }
}
```

Using the API, this collection field resolves in a nested GraphQL object:

```JSON
{
  findNews {
    result {
      tags {
        name
      }
    }
  }
}
```

Collection fields can also be nested to allow to have multiple levels of collections inside each other:

```JSON
{
  "title": "Content Blocks",
  "identifier": "content_blocks",
  "type": "collection",
  "settings": {
    "fields": [
      { "type": "text", "identifier": "headline", "title": "Headline" },
      { "type": "collection", "identifier": "blocks", "title": "Blocks", "settings": {
        "fields": [
          { "type": "wysiwyg", "identifier": "content", "title": "Content" }
        ]
      } }
    ]
  }
}
```

<!-- ######################################## -->

## File
unite cms does not manage any files directly but provides a file field that stores a reference using any s3 compatible API (Amazon, minio.io etc.). The file field renders an upload input element that allows the content editors to upload files directly to the s3 compatible server, using a presgined upload url. The file filed also reacts on content delete and update events and tries to delete files, that are not used anymore. In order to use the file field, set the required bucket and optional file_type settings:

```JSON
{
  "type": "file",
  "settings": {
    "bucket": {
      "endpoint": "S3 Endpoint",
      "bucket": "S3 Bucket",
      "path": "myfiles"
    },
    "file_types": "txt,pdf,doc"
  }
}
```

A typical Amazon S3 configuration with location EU (Frankfurt) would be: 

```JSON
{
  "bucket":{
    "endpoint": "https://s3.eu-central-1.amazonaws.com",
    "region": "eu-central-1",
    "key":"S3 KEY",
    "secret":"S3 SECRET",
    "bucket":"my_bucket"
  }
}
```

A typical minio.io configuration would be:

```JSON
{
  "bucket": { 
    "endpoint": "https://example.com:9000",
     "key": "S3 KEY", 
     "secret": "S3 SECRET", 
     "bucket": "my_bucket"
  }
}
```

<!-- ######################################## -->

## Image
The image type is an extension of the file input type that renders a thumbnail preview next to the upload input type and limits file_type to "png,gif,jpeg,jpg":

```JSON
{
  "type": "image",
  "settings": {
    "bucket": { ... },
    "thumbnail_url": "your_thumbnailing_service.com/{endpoint}/{id}/{name}"
  }
}
```

The optional thumbnail url allows you to add a link to the file directly or to any thumbnailing service. For a description of the bucket setting, please see the file type documentation.

<!-- ######################################## -->

## WYSIWYG Editor
The wysiwyg field renders a [ckeditor5](https://ckeditor.com/ckeditor-5/) "Classic" editor. You can set toolbar items and heading elements, according to the ckeditor documentation: 

```JSON
{
  "type": "wysiwyg",
  "settings": {
    "toolbar": ["bold", "italic", "|", "link", "|", "bulletedList", "numberedList", "|", "blockQuote"],
    "heading": ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"]
  }
}
```

<!-- ######################################## -->

## Variants field type
With the variants field you can define multiple variants, the editor can choose from. Each variant has a title, identifier, description, icon and a list of fields. Variants fields can be used if you want to create a dynamic content schema, for example a "name" in a CRM: For a company this would be the company name, for a person it would be the combination of a firstname and lastname field:

```JSON
{
  "identifier": "name",
  "type": "variants",
  "settings": {
    "variants": [
      {
        "title": "Company",
        "identifier": "company",
        "description": "This is a company",
        "icon": "home",
        "fields": [
          {
            "title": "Company name",
            "identifier": "company_name",
            "type": "text"
          }
        ]
      },
      {
        "title": "Person",
        "identifier": "person",
        "description": "This is a person",
        "icon": "user",
        "fields": [
          {
            "title": "Firstname",
            "identifier": "firstname",
            "type": "text"
          },
          {
            "title": "Lastname",
            "identifier": "lastname",
            "type": "text"
          }
        ]
      }
    ]
  }
}
```

When accessing variants via the GraphQL API, you can use [inline fragments](http://facebook.github.io/graphql/draft/#sec-Inline-Fragments) to access the variant for each content item:

```GraphQL
query {
  findContacts {
    result {
      name {
        type,
        
        ... on ContactsContentVariantCompanyVariant {
          company_name
        }

        ... on ContactsContentVariantPersonVariant {
          firstname,
          lastname
        }
      }
    }
  }
}
```

Another use case for variants fields (together with a collection field) are website layouts, where you want to allow the content editor to select one of multiple defined blocks (text, image, text+image):

(Coming soon)

<!-- ######################################## -->

## Link
A Link field type that allows to define an external Link. **Optionally** a Link Title and Link Target Setting can be activated with the following Settings:

```JSON
{
 ...
 "type": "link",
 "settings": {
   "title_widget": true,
   "target_widget": true
 }
}
```

<!-- ######################################## -->

## State
A state field that allows to define workflows for your content.

The following settings are mandatory:

**initial_place:** The initial place for your content, usually this is the place "draft". This place has to be defined inside places.

**places:** All places a content piece can be transisted to. A place must have a label and can have a category which is used for different colors. Currently the following categories are provided: primary / notice / info / success / warning / error / danger

**transitions:** All transitions for the defined places. A transition must have a label, a "from" setting (which is an array of the allowed places keys) and a "to" setting, which is the place where the content should be transisted to.

A very common example would be:

```JSON
{
 ...
 "type":"state",
 "settings":{
   "initial_place":"draft",
   "places":{
     "draft":{
       "label":"Draft",
       "category":"primary"
     },
     "review":{
       "label":"Review",
       "category":"info"
     },
     "published":{
       "label":"Published",
       "category":"success"
     }
   },
   "transitions":{
     "to_draft":{
       "label":"Set this content back to draft state",
       "from":[
         "published"
       ],
       "to":"draft"
     },
     "to_review":{
       "label":"Set this content to review state",
       "from":[
         "draft"
       ],
       "to":"review"
     },
     "to_published":{
       "label":"Set this content to published state",
       "from":[
         "review"
       ],
       "to":"published"
     }
   }
 }
}
```
