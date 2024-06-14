import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PointEditView from '../view/point-edit-view.js';
import { isEscapeKey } from '../utils/common-utils.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #citiesModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #onDataChange = null;

  #pointEditComponent = null;

  constructor({ pointListContainer, citiesModel, offersModel, changeDataHandler, destroyHandler, onDataChange }) {
    this.#pointListContainer = pointListContainer;
    this.#citiesModel = citiesModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = changeDataHandler;
    this.#handleDestroy = destroyHandler;
    this.#onDataChange = onDataChange;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      pointCities: this.#citiesModel.cities,
      pointOffers: this.#offersModel.offers,
      onFormSubmit: this.#handleEditSubmit,
      onEditDelete: this.#handleResetClick,
      isNewPoint: true
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleEditSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleResetClick = () => {
    this.destroy();
    this.#onDataChange(UpdateType.MINOR);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
