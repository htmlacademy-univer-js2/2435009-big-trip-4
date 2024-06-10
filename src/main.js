import BoardPresenter from './presenter/board-presenter.js';
import { RenderPosition, render } from './framework/render.js';
import PointModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import CitiesModel from './model/cities-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './point-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripMainElement = headerElement.querySelector('.trip-main');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const tripEvents = mainElement.querySelector('.trip-events');
const pointApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel(pointApiService);
const citiesModel = new CitiesModel(pointApiService);
const filterModel = new FilterModel();
const pointModel = new PointModel(pointApiService);
const boardPresenter = new BoardPresenter({
  tripMainContainer: tripMainElement,
  boardContainer: tripEvents,
  pointModel, offersModel,
  citiesModel, filterModel,
  onNewPointDestroy: handleNewPointFormClose });

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
boardPresenter.init();
offersModel.init().finally(() => {
  citiesModel.init().finally(() => {
    pointModel.init().finally(() => {
      render(newPointButtonComponent, tripMainElement, RenderPosition.BEFOREEND);
    });
  });
});
