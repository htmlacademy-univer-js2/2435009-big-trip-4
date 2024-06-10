function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    'base_price': Number(point.basePrice),
    'is_favorite': point.isFavorite
  };

  delete adaptedPoint.dateTo;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.isFavorite;
  delete adaptedPoint.basePrice;

  return adaptedPoint;
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
    basePrice: point['base_price'],
    isFavorite: point['is_favorite']
  };

  delete adaptedPoint['date_to'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['base_price'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}

export {
  adaptToClient,
  adaptToServer
};
