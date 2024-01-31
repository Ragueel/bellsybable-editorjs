import './style.css';

import { RenderRequest, RenderResponse } from './request';


const DEFAULT_STYLES = [
  'monokai',
];

const DEFAULT_LANGUAGES = [
  'go',
  'javascript',
  'typescript',
  'php',
  'bash'
];

class BellsybableBlock {
  private data: SaveData;
  private config: Config;

  static get toolbox() {
    return {
      title: 'Bellsybable Code Block',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor(block: any) {
    this.data = <SaveData>block.data;
    this.config = new Config();
  }

  render() {
    console.log(this.config);
    const wrapperDiv = create('div', ['bb-wrapper']);

    const input = <HTMLTextAreaElement>create('textarea', ['bb-code-block']);
    input.value = this.data ? this.data.code : '';
    input.rows = 5;

    const inputControls = create('div', ['bb-code-block']);
    const selectLanguage = <HTMLSelectElement>create('select', ['bb-select']);
    this.config.languages.forEach(lang => {
      const option = <HTMLOptionElement>create('option', ['bb-select-option']);
      option.value = lang;
      option.text = lang;
      selectLanguage.options.add(option);
    });

    const generateButton = <HTMLButtonElement>create('button', ['bb-button']);
    generateButton.textContent = 'Generate';

    inputControls.appendChild(selectLanguage);
    inputControls.appendChild(generateButton);

    const renderedDiv = create('div', ['bb-code-block', 'bb-rendered-code']);

    wrapperDiv.appendChild(inputControls);
    wrapperDiv.appendChild(input);
    wrapperDiv.appendChild(renderedDiv);

    return wrapperDiv;
  }
}

class SaveData {
  public code: string;
  public renderedCode: string;
  constructor(code: string, renderedCode: string) {
    this.code = code;
    this.renderedCode = renderedCode;
  }
}

class Config {
  public generatorFunction: Function;
  public styles: Array<string>;
  public languages: Array<string>;

  constructor(generatorFunction: Function | null = null, generateUrl: string = '/api/bellsybable/generate',
    styles: Array<string> | null = null, languages: Array<string> | null = null) {
    if (!generatorFunction) {
      this.generatorFunction = async (request: RenderRequest) => {
        const response = await fetch(generateUrl!, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });
        const responseJson = await response.json();
        return Promise.resolve(<RenderResponse>responseJson);
      };
    } else {
      this.generatorFunction = generatorFunction;
    }

    if (!styles) {
      this.styles = DEFAULT_STYLES;
    } else {
      this.styles = styles;
    }
    if (!languages) {
      this.languages = DEFAULT_LANGUAGES;
    } else {
      this.languages = languages;
    }
  }
}

function create(type: string, classes: Array<string> | null = null): HTMLElement {
  const element = document.createElement(type);
  if (classes) {
    element.classList.add(...classes);
  }

  return element;
}

export default BellsybableBlock;
