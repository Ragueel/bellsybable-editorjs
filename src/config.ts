import { RenderRequest, RenderResponse } from './request';
import { DEFAULT_LANGUAGES, DEFAULT_STYLES } from './constants';

class Config {
  public generatorFunction: Function;
  public styles: Array<string>;
  public languages: Array<string>;
  public autoGenerate: boolean;
  public defaultStyle: string;
  public defaultLanguage: string;

  constructor(generatorFunction: Function | null = null, generateUrl: string = 'http://127.0.0.1:6969/generate',
    styles: Array<string> | null = null, languages: Array<string> | null = null, autoGenerate: boolean = true,
    defaultStyle = "doom-one", defaultLanguage = "bash",
  ) {
    if (!generatorFunction) {
      this.generatorFunction = async (request: RenderRequest) => {
        const response = await fetch(generateUrl, {
          mode: 'cors',
          method: 'POST',
          headers: {
            "Access-Control-Allow-Origin": "*",
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
    this.autoGenerate = autoGenerate;
    this.defaultStyle = defaultStyle;
    this.defaultLanguage = defaultLanguage;
  }
}
export default Config;
