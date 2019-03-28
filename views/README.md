# VIEWS

_For each Content Type you can define one or multiple views for the management view of your content. The default view is a table, that just displays field columns and action buttons for each content row. Another example would be a media grid with drag and drop support view, that allows the user to sort images directly in the view. At the moment there are just two basic views available, however are planing to implement many different views (Kanban board, etc.) in the future!_

<!-- ######################################## -->

## Table
The following example defines a Table view for the Webpages Content Type. 

The following Settings are available:

**sort** (optional): Define the order of the content and if this order can be updated via drag and drop **fields** (optional): Set the fields to display as table columns. If this field is left empty, unite tries to find a text field **filter** (optional): again a filter possibility (see Section Filtering in GraphQL API), in this case we are filtering all results for subline = "My Subline"

```JSON
{
   ...,
   "content_types": [
       {
           "title": "Webpages",
           "identifier": "pages",
           "icon": "file",
           "fields": [
             { "title": "Headline", "identifier": "headline", "type": "text" },
             { "title": "Subline", "identifier": "subline", "type": "text" },
             { "title": "Description", "identifier": "description", "type": "text" },
             { "title": "Position", "identifier": "position", "type": "sortindex" }
           ]
       }
   ],
   "views": [
      {
          "title": "My Webpages Table",
          "identifier": "mytableview",
          "type": "table",
          "settings": {
            "sort": {
              "field": "position",
              "asc": true,
              "sortable": true
            },
            "fields": ["headline", "subline"],
            "filter": {
               "field": "subline",
               "operator": "=",
               "value": "My Subline"
            }
          }
      }
   ]
}
```

Fields can be set in the one of the following formats: 

**ONLY IDENTIFIERS**

unite cms will use the field type of the fields to render the fields and the field title as column headline

```JSON
{
  ...,
  "fields": ["id", "title", "updated"]
}
```

**FIELDS AND HEADLINES**

unite cms will use the field type of the fields to render the fields and your label 

```JSON
{
  ...,
  "fields": {
    "id": "This is my id",
    "headline": "My custom label"
  }
}
```

**FULL FIELD CONFIGURATION**

Configure title, identifier, type and settings for your fields. The following example would display one title column and one blocks column where all collection rows will be displayed.

```JSON
{
  ...,
  "fields": [
    {
      "title": "Title",
      "identifier": "title",
      "type": "text"
    },
    {
      "identifier": "blocks",
      "title": "Blocks",
      "type": "collection",
      "settings": {
      "fields": {
        "icon": { "label": "Icon", "type": "text", "settings": [] },
        "content": { "label": "Content", "type": "wysiwyg" }
      }
    }
  ]
}
```

 <!-- ######################################## -->

## Tree
The following example defines a Tree view for a Comments Content Type. 

The following Settings are available:

**children_field** (required): Select a field of type reference_of that must reference the same content type as the underlaying reference field **sort** (optional): Define the order of the content and if this order can be updated via drag and drop **fields** (optional): Set the fields to display as table columns. If this field is left empty, unite tries to find a text field **filter** (optional): again a filter possibility (see Section Filtering in GraphQL API)

```JSON
{
   ...,
   "content_types": [
       {
           "title": "Comments",
           "identifier": "comments",
           "icon": "file",
           "fields": [
             { "title": "Content", "identifier": "content", "type": "textarea" },
             { "title": "Position", "identifier": "position", "type": "sortindex" },
             { "title": "Parent", "identifier": "parent", "type": "reference", "settings":
                 { "domain": "...", "content_type": "comments" }
             },
             { "title": "Children", "identifier": "children", "type": "reference_of", "settings":
                 { "domain": "...", "content_type": "comments", "reference_field": "parent" }
             }
           ]
       }
   ],
   "views": [
      {
          "title": "Sortable comments",
          "identifier": "sortable_comments",
          "type": "tree",
          "settings": {
            "children_field": "children",
            "sort": {
              "field": "position",
              "sortable": true
            }
          }
      }
   ]
}
```

If sortable is set to false, this view only displays a tree without any filtering / nesting options

<!-- ######################################## -->

## Grid
The grid view type displays your content in 2d grid. The grid view type accepts the same config as the table view type, however for each field you can set one additional boolean option **"meta"**. If meta is set to true, the field will be rendered below the grid item. This should be used for non-primary information. A good example would be a media management view where the image of media content is the primary information and the updated date is the meta information: 

```JSON
"views": [
  {
    "title": "All",
    "identifier": "all",
    "type": "grid",
    "settings": {
      "sort": {
        "field": "position",
        "sortable": true
      },
      "fields": {
        "position": "Position",
        "image": "Image",
        "updated": {
          "meta": true
        }
      }
    }
  }
]
```
