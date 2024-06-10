import AbstractView from '../framework/view/abstract-view';


function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
    this.#hideNoPointsText();
  };

  #hideNoPointsText = () => {
    const noPointsTextElement = document.querySelector('.trip-events__msg');
    if (noPointsTextElement) {
      noPointsTextElement.style.display = 'none';
    }
  };
}
