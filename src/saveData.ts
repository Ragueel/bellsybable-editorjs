class SaveData {
  fileName: string;
  style: string;
  language: string;
  rawCode: string;
  formattedCode: string;

  constructor(fileName: string, style: string, language: string,
    rawCode: string, formattedCode: string) {
    this.fileName = fileName;
    this.style = style;
    this.language = language;
    this.rawCode = rawCode;
    this.formattedCode = formattedCode;
  }
}

export default SaveData;
