type Category = {
  name: string;
  maxPicks: number;
  choices: string[];
};

type CheckedCallback = (category: Category, checked: boolean) => void;

type SliderInputCallback = (category: Category, value: number) => void;

type CategoriesCallbacks = {
  onChecked: CheckedCallback;
  onSliderInput: SliderInputCallback;
}

type CategoryPick = {
  name: string;
  picks: string[];
};

type Selection = {
  category: Category;
  numPicks: number;
};

type State = {
  selections: Selection[];
  picks: CategoryPick[];
};

const CATEGORIES: Category[] = [
  Object.freeze({ name: 'foo', maxPicks: 3, choices: ['foo1', 'foo2', 'foo3', 'foo4', 'foo5'] }),
  Object.freeze({ name: 'bar', maxPicks: 1, choices: ['bar1', 'bar2', 'bar3', 'bar4', 'bar5'] }),
  Object.freeze({ name: 'baz', maxPicks: 2, choices: ['baz1', 'baz2', 'baz3', 'baz4', 'baz5'] }),
];

const CATEGORY_UL_ID = 'category-list';

const renderCategories = (
  categories: Category[],
  callbacks: CategoriesCallbacks,
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
      callbacks.onChecked(category, event.target.checked);
    });

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = category.maxPicks.toString();
    slider.addEventListener('input', () => {
      callbacks.onSliderInput(category, parseInt(slider.value, 10));
    });
    
    li.append(input, label, slider);
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

const getCategoryChoices = (selection: Selection): string[] => {
  return shuffle(selection.category.choices).slice(0, selection.numPicks);
};

const getPick = (selection: Selection): CategoryPick => {
  return {
    name: selection.category.name,
    picks: getCategoryChoices(selection)
  }
};

export const main = () => {
  const state: State = {
    selections: [],
    picks: [],
  };
  const refresh = () => {
    renderPicks(state);
    renderState(state);
  };
  const generate = (name?: string) => {
    if (name) {
      const index = state.picks.findIndex((p) => p.name === name);
      const selection = state.selections.find((s) => s.category.name === name);
      if (index >= 0 && selection) {
        state.picks[index] = getPick(selection);
      }
    } else {
      state.picks = state.selections.map(getPick);
    }
    refresh();
  };

  renderCategories(CATEGORIES, { 
    onChecked: (category, checked) => {
      if (checked) {
        state.selections.push({ category, numPicks: category.maxPicks });
      } else {
        state.selections = state.selections.filter((s) => {
          return s.category.name !== category.name
        });
      }
      generate(category.name);
    }, 
    onSliderInput: (category, value) => {
      const selection = state.selections.find((s) => s.category.name === category.name);
      if (selection) {
        selection.numPicks = value;
        generate(category.name);
      }
    },
  });

  const button = document.getElementById('generate')!;
  button.addEventListener('click', () => {
    generate();
  });

  refresh();
};

main();
