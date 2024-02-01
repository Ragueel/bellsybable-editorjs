import './style.css';

import { createEl, createSelect } from './utils';
import Config from './config';
import { RenderRequest } from './request';

class BellsybableBlock {
  private data: SaveData;
  private config: Config;
  private wrapper: HTMLElement | null;

  static get toolbox() {
    return {
      title: 'Bellsybable Code Block',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor(block: any) {
    this.data = <SaveData>block.data;
    this.config = new Config();
    this.wrapper = null;
  }

  static get enableLineBreaks() {
    return true;
  }

  render() {
    const wrapperDiv = createEl('div', ['bb-wrapper']);
    this.wrapper = wrapperDiv;

    const codeArea = <HTMLTextAreaElement>createEl('textarea', ['bb-code-block', 'bb-code-area', 'bb-input']);
    codeArea.value = this.data ? this.data.code : '';
    codeArea.rows = 9;
    const gCode = async () => await this.generateCode();
    if (this.config.autoGenerate) {
      const autoGenerateTimeout = 1500;
      let typingTimer: number | undefined;
      codeArea.addEventListener('keyup', () => {
        if (typingTimer) {
          clearTimeout(typingTimer);
        }
        if (codeArea.value) {
          typingTimer = setTimeout(gCode, autoGenerateTimeout);
        }
      });
    }

    const inputControls = createEl('div', ['bb-code-block', 'bb-input-controls']);
    const codeBlockName = <HTMLInputElement>createEl('input', ['bb-input']);
    codeBlockName.type = 'text';

    const selectLanguage = createSelect('bb-select', this.config.languages);
    selectLanguage.value = this.config.defaultLanguage;
    const selectStyle = createSelect('bb-select', this.config.styles);
    selectStyle.value = this.config.defaultStyle;

    const generateButton = <HTMLButtonElement>createEl('button', ['bb-button']);
    generateButton.textContent = 'Generate';
    generateButton.addEventListener('click', async () => {
      await gCode();
    });

    inputControls.appendChild(codeBlockName);
    inputControls.appendChild(selectLanguage);
    inputControls.appendChild(selectStyle);
    inputControls.appendChild(generateButton);

    const renderedDiv = createEl('div', ['bb-code-block', 'bb-rendered-code']);

    wrapperDiv.appendChild(inputControls);
    wrapperDiv.appendChild(codeArea);
    wrapperDiv.appendChild(renderedDiv);

    return wrapperDiv;
  }

  async generateCode() {
    if (!this.wrapper) {
      console.error('Wrapper is not initialized');
      return;
    }
    const code = this._getAreaCodeFromWrapper();
    const language = this._getLanguageFromWrapper();
    const style = this._getStyleFromWrapper();

    const request = new RenderRequest(code, style, language);

    const response = await this.config.generatorFunction(request);

    const generatedCodeBlock = this.wrapper.children[2];
    generatedCodeBlock.innerHTML = response.code;
  }

  _getAreaCodeFromWrapper(): string {
    const textArea = <HTMLTextAreaElement>this.wrapper!.children[1];
    return textArea.value;
  }

  _getLanguageFromWrapper() {
    const languageSelect = <HTMLSelectElement>this.wrapper!.children[0].children[1];
    return languageSelect.value;
  }

  _getStyleFromWrapper() {
    const styleSelect = <HTMLSelectElement>this.wrapper!.children[0].children[2];
    return styleSelect.value;
  }

  save() {
    //  asasd
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


export default BellsybableBlock;
