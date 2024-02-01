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
      title: 'BB Code Block',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>'
    };
  }

  constructor(block: any) {
    this.data = Object.keys(block.data).length > 0 ? <SaveData>block.data : null;
    this.config = Object.keys(block.config).length > 0 ? Config.fromExistingConfig(block.config) : new Config();
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
    if (code.length == 0) {
      return
    }

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
