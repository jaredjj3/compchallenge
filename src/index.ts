type Category = {
  name: string;
  maxPicks: number;
  choices: string[];
};

type CheckedCallback = (category: Category, checked: boolean) => void;

type State = {
  selectedCategories: Category[];
};

type Foo = {
  foo: string;
}

type Bar = {
  foo: number;
  bar: string;
}

type Baz = Foo & Bar;

const baz: Baz = { foo: 'asdf'}

const CATEGORIES: Category[] = [
  { name: 'foo', maxPicks: 3, choices: ['foo1', 'foo2', 'foo3'] },
  { name: 'bar', maxPicks: 1, choices: ['bar1', 'bar2', 'bar3'] },
  { name: 'baz', maxPicks: 2, choices: ['baz1', 'baz2', 'baz3'] },
];

const CATEGORY_UL_ID = 'category-list';

const renderCategories = (
  categories: Category[],
  onChecked: CheckedCallback, 
): void => {
  const div = document.getElementById('categories')!;
  const ul = document.createElement('ul');
  ul.setAttribute('id', CATEGORY_UL_ID);

  for (const category of categories) {
    const id = `checkbox-${category.name}`;
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.innerText = category.name;
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('id', id);
    input.addEventListener('change', (event: any) => {
      onChecked(category, event.target.checked);
    });
    
    li.append(input, label);
    ul.appendChild(li);
  }

  div.appendChild(ul);
};

const renderState = (state: State): void => {
  const pre = document.getElementById('state')!;
  pre.innerText = JSON.stringify(state, null, 2);
};

export const main = () => {
  const state: State = {
    selectedCategories: [],
  };

  renderState(state);

  renderCategories(CATEGORIES, (category, checked) => {
    if (checked) {
      state.selectedCategories.push(category);
    } else {
      state.selectedCategories = state.selectedCategories.filter((c) => {
        return c.name !== category.name
      });
    }
    renderState(state);
  });


};

main();
