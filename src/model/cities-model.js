export default class CitiesModel {
  #cities = [];
  #pointApiService = null;

  constructor(pointApiService) {
    this.#pointApiService = pointApiService;
  }

  get cities() {
    return this.#cities;
  }

  async init() {
    this.#cities = await this.#pointApiService.destinations;
    return this.#cities;
  }

  getById(id) {
    return this.#cities.find((cit) => cit.id === id);
  }
}
