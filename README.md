# bellsybable-block

Generate beautiful code blocks with syntax highlights for editor.js.

![Demo Usage](/assets/demo.gif)

Ideally the block should be used with this backend server:

[https://github.com/Ragueel/bellsybable](https://github.com/Ragueel/bellsybable)

## Installation

```bash
npm i bellsybable-block
```

## Usage

```javascript
import BellsybableBlock from "bellsybable-block";

const editor = new EditorJS({
  autofocus: true,
  tools: {
    bellsybable: {
      class: BellsybableBlock,
      config: {
        languages: ["bash", "python"],
      },
    },
  },
});
```

### Configuration Options:

| name              | description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| generatorFunction | Function used to send your request. See payload structure:[Payload](/https://github.com/Ragueel/bellsybable-editorjs/) |
| generateUrl       | If you are using default generator just change it to a desired endpoint                                                |
| styles            | Themes that can be used during rendering. See: [styles](/docs/styles.md)                                               |
| languages         | Languages that bellsybable supports. See: [languages](/docs/languages.md)                                              |
| autoGenerate      | `true` or `false` whether to send automatically render request after user finishes typing                              |
| defaultStyle      | which style should new blocks use                                                                                      |
| defaultLanguage   | which language is selected by default                                                                                  |

## Custom backend

You can use some other custom backend that returns structure in a correct response format.

Request will be a POST method with the following structure:

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
