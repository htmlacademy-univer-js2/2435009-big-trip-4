import { FilterType, SortType, TimeLimit, UpdateType, UserAction, filters } from '../const';
import { RenderPosition, remove, render } from '../framework/render.js';
import { sortByPrice, sortByTime } from '../utils/point-utils.js';
import EventEmptyListView from '../view/event-list-empty.js';
import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import LoadingView from '../view/loading-view.js';

export default class BoardPresenter {
  #eventsContainer = null;
  #pointModel = null;
  #citiesModel = null;
  #offersModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noPointComponent = null;
  #isLoading = true;
  #tripInfoComponent = null;
  #loadingViewComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #eventsComponent = new EventListView();
  #tripMainContainer = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({ tripMainContainer, boardContainer, pointModel, citiesModel, offersModel, filterModel, onNewPointDestroy }) {
    this.#tripMainContainer = tripMainContainer;
    this.#eventsContainer = boardContainer;
    this.#pointModel = pointModel;
    this.#citiesModel = citiesModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventsContainer,
      citiesModel: this.#citiesModel,
      offersModel: this.#offersModel,
      changeDataHandler: this.#handleViewAction,
      destroyHandler: onNewPointDestroy,
      onDataChange: this.#handleModelPoint
    });

    this.#pointModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filters[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderBoard() {
    if (this.points.length === 0 && !this.#isLoading) {
      this.#renderNoPointView();
      return;
    }

    if (this.#isLoading) {
      this.#renderLoadingView();
      return;
    }

    this.#renderPointList();
    this.#renderPoints();
    this.#renderTripInfoView();

    this.#renderSortView();
  }


  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingViewComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTripInfoView() {
    if (this.#tripInfoComponent !== null) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfoView(this.#pointModel, this.#offersModel, this.#citiesModel);

    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({ resetRenderedTaskCount: true });
    this.#renderBoard();
  };

  #renderSortView() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.#eventsComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderPointList() {
    render(this.#eventsComponent, this.#eventsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#eventsComponent.element,
      citiesModel: this.#citiesModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    if (this.#noPointComponent !== null) {
      remove(this.#noPointComponent);
    }

    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPointView() {
    this.#noPointComponent = new EventEmptyListView(this.#isLoading);

    render(this.#noPointComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoadingView() {
    this.#loadingViewComponent = new LoadingView();

    render(this.#loadingViewComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingViewComponent);
        this.#renderBoard();
        break;
    }
  };
}
