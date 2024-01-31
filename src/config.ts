import { RenderRequest, RenderResponse } from './request';

const DEFAULT_STYLES = [
  'monokai',
];

const DEFAULT_LANGUAGES = [
  'go',
  'javascript',
  'typescript',
  'php',
  'bash',
];


class Config {
  public generatorFunction: Function;
  public styles: Array<string>;
  public languages: Array<string>;

  constructor(generatorFunction: Function | null = null, generateUrl: string = 'http://127.0.0.1:5000/generate',
    styles: Array<string> | null = null, languages: Array<string> | null = null) {
    if (!generatorFunction) {
      this.generatorFunction = async (request: RenderRequest) => {
        const response = await fetch(generateUrl, {
          mode: 'no-cors',
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
      this.styles = DEFAULT_STYLES.sort((a, b) => a.localeCompare(b));
    } else {
      this.styles = styles;
    }
    if (!languages) {
      this.languages = DEFAULT_LANGUAGES.sort((a, b) => a.localeCompare(b));
    } else {
      this.languages = languages;
    }
  }
}
export default Config;
