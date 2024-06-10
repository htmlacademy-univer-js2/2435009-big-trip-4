import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import { ButtonText, EMPTY_POINT, EVENTS } from '../const.js';
import { getFullDate } from '../utils/point-utils.js';

function createTypesElement(currentType, isDisabled) {
  const result = EVENTS.map((eventType) => `<div class="event__type-item">
              <input id="event-type-${eventType.toLowerCase()}-1" class="event__${eventType.toLowerCase()}-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${currentType === eventType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
              <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType} ${currentType === eventType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}</label>
            </div>`);
  return `<fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${result.join('')}
          </fieldset>`;
}

function createDestinationElement(cities) {
  const result = cities.map((city) => `<option value="${city.name}"></option>`);
  return `<datalist id="destination-list-1">
    ${result.join('')}
  </datalist>`;
}

function createDeleteButtonTemplate(isNewPoint, isDeleting, isDisabled) {
  let buttonText = isDeleting ? ButtonText.DELETING : ButtonText.DELETE;
  buttonText = isNewPoint ? ButtonText.CANCEL : buttonText;

  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>`;
}

function createPointOfferElement(offers, checkedOffers, isDisabled) {
  const offersElement = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${checkedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');

  return `<div class="event__available-offers">${offersElement}</div>`;
}

function createImagesElement(currentDestination) {
  const currentPhotos = currentDestination ? currentDestination.pictures : [];
  return currentPhotos ? currentPhotos.map((img) => `<img class="event__photo" src="${img.src}" alt="Event photo">`).join('') : '';
}

function createPointEditTemplate({ point, pointCities, pointOffers, isNewPoint }) {
  const { type, offers, dateFrom, dateTo, basePrice, isDisabled, isSaving, isDeleting } = point;
  const currentOffers = pointOffers.find((offer) => offer.type === type.toLowerCase());
  const currentDestination = pointCities.find((destination) => destination.id === point.destination);

  return (
    `
    <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          ${createTypesElement(type, isDisabled)}
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(currentDestination ? currentDestination.name : '')}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        ${createDestinationElement(pointCities)}
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFullDate(dateFrom)}${isDisabled ? 'disabled' : ''}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFullDate(dateTo)}${isDisabled ? 'disabled' : ''}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(basePrice.toString())}" ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? ButtonText.SAVING : ButtonText.SAVE}</button>
      ${createDeleteButtonTemplate(isNewPoint, isDeleting, isDisabled)}
      ${isNewPoint ? '' : '<button class="event__rollup-btn" type="button"></button>'}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${createPointOfferElement(currentOffers.offers, offers, isDisabled)}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination ? currentDestination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${createImagesElement(currentDestination)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>
    `
  );
}

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleRollUpClick = null;
  #handleEditDelete = null;
  #cities = null;
  #offers = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #isNewPoint = null;
  constructor({ point = EMPTY_POINT, pointCities, pointOffers, onFormSubmit, onRollUpClick, onEditDelete, isNewPoint = false }) {
    super();
    this.#offers = pointOffers;
    this.#cities = pointCities;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollUpClick = onRollUpClick;
    this.#handleEditDelete = onEditDelete;
    this.#isNewPoint = isNewPoint;
    this._setState(PointEditView.parsePointToState(point));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      pointCities: this.#cities,
      pointOffers: this.#offers,
      isNewPoint: this.#isNewPoint
    });
  }

  removeElement() {
    super.removeElement();
    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }
    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#pointPriceChangeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#pointOfferChangeHandler);
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    if (this.#isNewPoint) {
      this.element.querySelector('.event--edit')
        .addEventListener('reset', this.#editDeleteHandler);
    } else {
      this.element.querySelector('.event--edit')
        .addEventListener('reset', this.#editDeleteHandler);
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollUpButtonClick);
    }
    this.#setDatePickerTo();
    this.#setDatePickerFrom();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #editDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditDelete(PointEditView.parseStateToPoint(this._state));
  };

  #rollUpButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#cities.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: selectedDestination ? selectedDestination.id : null,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      ...this._state,
      basePrice: evt.target.value,
    });
  };

  #pointDateFromChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate,
    });
    this.#datePickerTo.set('minDate', this._state.dateFrom);
  };

  #pointDateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate,
    });
    this.#datePickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatePickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datePickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#pointDateFromChangeHandler,
        },
      );
    }
  };

  #setDatePickerTo = () => {
    if (this._state.dateTo) {
      this.#datePickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#pointDateToChangeHandler,
        },
      );
    }
  };

  #pointOfferChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      ...this._state,
      offers: checkedOffers.map((item) => item.id),
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
