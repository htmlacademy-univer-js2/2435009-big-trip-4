import { DISABLED_SORTS, SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';

function createSortItemsTemplate(type, currentSortType) {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
            <input id="sort-${type}" class="trip-sort__input  visually-hidden" data-sort-type="${type}" type="radio" name="trip-sort" value="sort-${type}" ${currentSortType === type ? 'checked' : ''} ${DISABLED_SORTS.includes(type) ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${type}">${type}</label>
          </div>`;
}

function createSortTemplate(currentSortType) {
  const sortItems = Object.values(SortType).map((type) =>
    createSortItemsTemplate(type, currentSortType)).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
           ${sortItems}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
