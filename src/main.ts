import './style.css';

import { createEl, createSelect } from './utils';
import Config from './config';
import { RenderRequest } from './request';
import SaveData from './saveData';

class BellsybableBlock {
  private data: SaveData | null;
  private config: Config;
  private wrapper: HTMLElement | null;

  static get toolbox() {
    return {
      title: 'Bellsybable Code Block',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor(block: any) {
    this.data = Object.keys(block.data).length > 0 ? <SaveData>block.data : null;
    this.config = Object.keys(block.config).length > 0 ? <Config>block.config : new Config();
    this.wrapper = null;
  }

  static get enableLineBreaks() {
    return true;
  }

  render() {
    const wrapperDiv = createEl('div', ['bb-wrapper']);
    this.wrapper = wrapperDiv;

    const codeArea = <HTMLTextAreaElement>createEl('textarea', ['bb-code-block', 'bb-code-area', 'bb-input']);
    codeArea.value = this.data ? this.data.rawCode : '';
    codeArea.rows = 9;
    const gCode = async () => await this.generateCode();


    const inputControls = createEl('div', ['bb-code-block', 'bb-input-controls']);
    const codeBlockName = <HTMLInputElement>createEl('input', ['bb-input']);
    codeBlockName.type = 'text';
    codeBlockName.value = this.data ? this.data.fileName : '';

    const selectLanguage = createSelect('bb-select', this.config.languages);
    selectLanguage.value = this.data ? this.data.language : this.config.defaultLanguage;
    const selectStyle = createSelect('bb-select', this.config.styles);
    selectStyle.value = this.data ? this.data.style : this.config.defaultStyle;

    const generateButton = <HTMLButtonElement>createEl('button', ['bb-button']);
    generateButton.textContent = 'Generate';
    generateButton.addEventListener('click', async () => {
      await gCode();
    });
    if (this.config.autoGenerate) {
      const autoGenerateTimeoutMilliSeconds = 1000;
      let typingTimer: number | undefined;
      codeArea.addEventListener('keyup', () => {
        if (typingTimer) {
          clearTimeout(typingTimer);
        }
        if (codeArea.value) {
          typingTimer = setTimeout(gCode, autoGenerateTimeoutMilliSeconds);
        }
      });
      selectStyle.addEventListener('change', async () => await gCode());
      selectLanguage.addEventListener('change', async () => await gCode());
    }

    inputControls.appendChild(codeBlockName);
    inputControls.appendChild(selectLanguage);
    inputControls.appendChild(selectStyle);
    inputControls.appendChild(generateButton);

    const renderedDiv = createEl('div', ['bb-code-block', 'bb-rendered-code']);
    renderedDiv.innerHTML = this.data ? this.data.formattedCode : '';

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
    const code = this._getRawCode();
    const language = this._getLanguage();
    const style = this._getStyle();

    const request = new RenderRequest(code, style, language);

    const response = await this.config.generatorFunction(request);

    const generatedCodeBlock = this.wrapper.children[2];
    generatedCodeBlock.innerHTML = response.code;
  }

  _getRawCode(): string {
    const textArea = <HTMLTextAreaElement>this.wrapper!.children[1];
    return textArea.value;
  }

  _getLanguage(): string {
    const languageSelect = <HTMLSelectElement>this.wrapper!.children[0].children[1];
    return languageSelect.value;
  }

  _getStyle(): string {
    const styleSelect = <HTMLSelectElement>this.wrapper!.children[0].children[2];
    return styleSelect.value;
  }

  _getFormattedCode(): string {
    return <string>this.wrapper!.children[2].innerHTML;
  }

  _getFileName(): string {
    const languageSelect = <HTMLInputElement>this.wrapper!.children[0].children[0];
    return languageSelect.value;
  }

  save() {
    if (!this.wrapper) {
      throw new Error("No wrapper initialized");
    }

    const fileName = this._getFileName();
    const language = this._getLanguage();
    const style = this._getStyle();
    const rawCode = this._getRawCode();
    const formattedCode = this._getFormattedCode();

    return new SaveData(fileName, style, language, rawCode, formattedCode);
  }
}

export default BellsybableBlock;
