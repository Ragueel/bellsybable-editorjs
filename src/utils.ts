
function createSelect(className: string, options: Array<string>): HTMLSelectElement {
  const selectField = <HTMLSelectElement>createEl('select', [className]);
  options.forEach(optionItem => {
    selectField.options.add(createOption(optionItem));
  });
  return selectField;
}

function createOption(item: string): HTMLOptionElement {
  const option = <HTMLOptionElement>createEl('option', ['bb-select-option']);
  option.value = item;
  option.text = item;
  return option;
}

function createEl(type: string, classes: Array<string> | null = null): HTMLElement {
  const element = document.createElement(type);
  if (classes) {
    element.classList.add(...classes);
  }

  return element;
}

export { createSelect, createEl };
