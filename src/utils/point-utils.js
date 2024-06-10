import dayjs from 'dayjs';

function getTime(data) {
  return dayjs(data).format('hh:mm');
}

function getMonthAndDate(data) {
  return dayjs(data).format('MMM DD');
}

function getFullDate(data) {
  return dayjs(data).format('DD/MM/YY hh:mm');
}

function getDateDifference(from, to) {
  const difference = dayjs(to).diff(dayjs(from));
  let pointDur = 0;

  switch (true) {
    case (difference >= 24 * 60 * 60 * 1000):
      pointDur = dayjs(difference).format('DD[D] HH[H] mm[M]');
      break;
    case (difference >= 60 * 60 * 1000):
      pointDur = dayjs(difference).format('HH[H] mm[M]');
      break;
    case (difference < 60 * 60 * 1000):
      pointDur = dayjs(difference).format('mm[M]');
      break;
  }
  return pointDur;
}

function pastPoint(point) {
  return dayjs().isAfter(point.dateTo);
}

function futurePoint(point) {
  return dayjs().isBefore(point.dateFrom);
}

function presentPoint(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortByDay(pointFirst, pointSecond) {
  return dayjs(pointFirst.dateFrom) - dayjs(pointSecond.dateFrom);
}

function sortByTime(pointFirst, pointSecond) {
  return dayjs(pointFirst.dateTo).diff(dayjs(pointFirst.dateFrom)) - dayjs(pointSecond.dateTo).diff(dayjs(pointSecond.dateFrom));
}

function sortByPrice(pointFirst, pointSecond) {
  return pointFirst.basePrice - pointSecond.basePrice;
}

function hasBigDifference(point1, point2) {
  return point1.price !== point2.price
    || getDateDifference(point1.dateFrom, point1.dateTo) !== getDateDifference(point2.dateFrom, point2.dateTo)
    || point1.destination !== point2.destination
    || point1.offers !== point2.offers;
}


export {
  getTime,
  getMonthAndDate,
  getDateDifference,
  getFullDate,
  pastPoint,
  futurePoint,
  presentPoint,
  updateItem,
  sortByPrice,
  sortByDay,
  sortByTime,
  hasBigDifference
};
