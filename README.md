# bellsybable-block

Generate beautiful code blocks with syntax highlights for editor.js.

![Demo Usage](/assets/demo.gif)

Ideally the bellsybable-block should be used with this backend server that does SSR of the raw code:

[https://github.com/Ragueel/bellsybable](https://github.com/Ragueel/bellsybable)

It has integration with [https://github.com/alecthomas/chroma](https://github.com/alecthomas/chroma) which does the heavy the lifting of converting the strings into a stream of tokens, and then applies styling to them.

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

## Output Data

```json
{
  "id": "J4JNR4QdKX",
  "type": "bellsybable",
  "data": {
    "fileName": "sample.py",
    "style": "dracula",
    "language": "python",
    "rawCode": "import json\n\nexample_dict = {'hello': 'world'}\n\nprint(example_dict)",
    "formattedCode": "<pre tabindex=\"0\" style=\"color:#f8f8f2;background-color:#282a36;\"><code><span style=\"display:flex;\"><span><span style=\"color:#ff79c6\">import</span> json\n</span></span><span style=\"display:flex;\"><span>\n</span></span><span style=\"display:flex;\"><span>example_dict <span style=\"color:#ff79c6\">=</span> {<span style=\"color:#f1fa8c\"></span><span style=\"color:#f1fa8c\">'</span><span style=\"color:#f1fa8c\">hello</span><span style=\"color:#f1fa8c\">'</span>: <span style=\"color:#f1fa8c\"></span><span style=\"color:#f1fa8c\">'</span><span style=\"color:#f1fa8c\">world</span><span style=\"color:#f1fa8c\">'</span>}\n</span></span><span style=\"display:flex;\"><span>\n</span></span><span style=\"display:flex;\"><span><span style=\"color:#8be9fd;font-style:italic\">print</span>(example_dict)</span></span></code></pre>"
  }
}
```

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
