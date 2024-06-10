import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemElement(filter, currentFilterType) {
  const { type, count } = filter;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${count ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
}

function createFilterElement(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems.map((filter) =>
    createFilterItemElement(filter, currentFilterType))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filter, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filter;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterElement(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
