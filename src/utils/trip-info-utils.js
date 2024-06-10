import dayjs from 'dayjs';
import { getMonthAndDate } from './point-utils';

function getPointsDataRange(points) {
  const startDate = getMonthAndDate(points[0].dateFrom);
  const pointWithEndDate = points.reduce((maxDatePoint, currentPoint) =>
    (dayjs(maxDatePoint.dateTo) < dayjs(currentPoint.dateTo)) ? currentPoint : maxDatePoint);
  const endDate = getMonthAndDate(pointWithEndDate.dateTo);

  return { startDate, endDate };
}

function getTripRoute(points, cityModel) {
  const cities = [];

  points.forEach((point) => {
    cities.push(cityModel.getById(point.destination).name);
  });

  return cities;
}

function getTripPrice(points, offerModel) {
  let result = 0;

  points.forEach((point) => {
    result += point.basePrice;
    result += getPointOffersPrice(point, offerModel);
  });

  return result;
}

function getPointOffersPrice(point, offerModel) {
  let result = 0;
  const pointOffers = offerModel.getOffersByType(point.type);

  pointOffers.forEach((offer) => {
    if (point.offers.includes(offer.id)) {
      result += offer.price;
    }
  });

  return result;
}

export {
  getPointsDataRange,
  getTripRoute,
  getTripPrice
};
