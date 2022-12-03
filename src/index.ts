type Category<T> = {
  name: string;
  maxPicks: number;
  choices: T[];
};

const CATEGORIES: Array<Category<string>> = [
  { name: 'foo', maxPicks: 3, choices: ['foo1', 'foo2', 'foo3'] },
  { name: 'bar', maxPicks: 1, choices: ['bar1', 'bar2', 'bar3'] },
  { name: 'baz', maxPicks: 2, choices: ['baz1', 'baz2', 'baz3'] },
];

const renderCategories = (categories: Array<Category<string>>): void => {
  const div = document.getElementById('categories')!;
  const ul = document.createElement('ul');

  for (const category of categories) {
    const id = `checkbox-${category.name}`;
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.innerText = category.name;
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('id', id);
    
    li.append(input, label);
    ul.appendChild(li);
  }

  div.appendChild(ul);
};

export const main = () => {
  renderCategories(CATEGORIES);
};

main();
