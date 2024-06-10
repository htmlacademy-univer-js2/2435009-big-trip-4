import { CITIES_LENGTH_BORDER } from '../const';
import AbstractView from '../framework/view/abstract-view';
import { getPointsDataRange, getTripPrice, getTripRoute } from '../utils/trip-info-utils';

function createTripInfoTemplate({ dateRange, cities, totalPrice }) {
  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities.length > CITIES_LENGTH_BORDER ? `${cities[0]} &mdash; .... &mdash; ${cities.at(-1)}` : cities.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${dateRange.startDate}&nbsp;&mdash;&nbsp;${dateRange.endDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #pointModel = null;
  #offerModel = null;
  #cityModel = null;

  constructor(pointModel, offerModel, cityModel) {
    super();
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#cityModel = cityModel;
  }

  get template () {
    return createTripInfoTemplate({
      dateRange: getPointsDataRange(this.#pointModel.points),
      cities: getTripRoute(this.#pointModel.points, this.#cityModel),
      totalPrice: getTripPrice(this.#pointModel.points, this.#offerModel)
    });
  }
}
