
function createSelect(className: string, options: Array<string>): HTMLSelectElement {
  const selectLanguage = <HTMLSelectElement>createEl('select', [className]);
  options.forEach(optionItem => {
    const option = <HTMLOptionElement>createEl('option', ['bb-select-option']);
    option.value = optionItem;
    option.text = optionItem;
    selectLanguage.options.add(option);
  });

  return selectLanguage;
}

function createEl(type: string, classes: Array<string> | null = null): HTMLElement {
  const element = document.createElement(type);
  if (classes) {
    element.classList.add(...classes);
  }

  return element;
}

export { createSelect, createEl };
