
class RenderRequest {
  public code: string;
  public style: string;
  public language: string;

  constructor(code: string, style: string, language: string) {
    this.code = code;
    this.style = style;
    this.language = language;
  }
}

class RenderResponse {
  public code: string;

  constructor(code: string) {
    this.code = code;
  }
}

export { RenderRequest, RenderResponse };
