type Category = {
  name: string;
  numPicks: number;
  choices: string[];
};

type CheckedCallback = (category: Category, checked: boolean) => void;

type CategoryPick = {
  name: string;
  picks: string[];
};

type State = {
  selectedCategories: Category[];
  picks: CategoryPick[];
};

const CATEGORIES: Category[] = [
  { name: 'foo', numPicks: 3, choices: ['foo1', 'foo2', 'foo3', 'foo4', 'foo5'] },
  { name: 'bar', numPicks: 1, choices: ['bar1', 'bar2', 'bar3', 'bar4', 'bar5'] },
  { name: 'baz', numPicks: 2, choices: ['baz1', 'baz2', 'baz3', 'baz4', 'baz5'] },
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

const renderPicks = (state: State): void => {
  const div = document.getElementById('picks')!;
  const ul = document.createElement('ul');

  for (const pick of state.picks) {
    const li = document.createElement('li');
    li.innerText = `${pick.name}: ${pick.picks.join(', ')}`;
    ul.appendChild(li);
  }

  div.replaceChild(ul, div.firstChild!);
};

const shuffle = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getCategoryChoices = (category: Category): string[] => {
  return shuffle(category.choices).slice(0, category.numPicks);
};

const getPicks = (category: Category): CategoryPick => {
  return {
    name: category.name,
    picks: getCategoryChoices(category)
  }
};

export const main = () => {
  const state: State = {
    selectedCategories: [],
    picks: [],
  };
  const refresh = () => {
    renderPicks(state);
    renderState(state);
  };

  renderCategories(CATEGORIES, (category, checked) => {
    if (checked) {
      state.selectedCategories.push(category);
    } else {
      state.selectedCategories = state.selectedCategories.filter((c) => {
        return c.name !== category.name
      });
    }
    refresh();
  });

  const button = document.getElementById('generate')!;
  button.addEventListener('click', () => {
    state.picks = state.selectedCategories.map(getPicks);
    refresh();
  });

  refresh();
};

main();
