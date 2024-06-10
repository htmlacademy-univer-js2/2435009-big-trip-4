import { Method } from './const.js';
import ApiService from './framework/api-service.js';
import { adaptToServer } from './utils/adapt-utils.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(update) {
    const response = await this._load({
      url: `points/${update.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptToServer(update)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
