# bellsybable-block

Generates beautiful code blocks with highlights for editor.js. 

Ideally should be used with [https://github.com/Ragueel/bellsybable](https://github.com/Ragueel/bellsybable)

### Configuration:

| name            | description |
|-----------------|-------------|
|generatorFunction| Function used to send your request. See payload structure:[Payload](/assets/)
|generateUrl      | If you are using default generator just change it to a desired endpoint
|styles           | Generation styles that can be used during rendering. See [styles](/docs/styles)
|languages        | Languages that highlight should work
|autoGenerate     | `true` or `false` whether to send automatically render request after user finishes typing
|defaultStyle     | which style should new blocks use
|defaultLanguage  | which language is selected by default


## Custom backend

You can use some other custom backend that returns structure in a correct response format. 

Request will be POST method with the following structure:
```json
{
  "code": "WRITTEN_CODE",
  "language": "SELECTED_LANGUAGE",
  "style": "SELECTED_STYLE"
}
```

Expected Response:

```json
{
  "code": "YOUR_RENDERED_CODE"
}
```
