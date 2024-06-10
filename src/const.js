import dayjs from 'dayjs';
import { futurePoint, presentPoint, pastPoint, sortByDay, sortByPrice, sortByTime } from './utils/point-utils';

const DEFAULT_TYPE = 'taxi';
const CITIES_LENGTH_BORDER = 3;
const AUTHORIZATION = 'Basic hS2sfS44wcl321211';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const DISABLED_SORTS = [
  'event',
  'offers'
];

const EMPTY_POINT = {
  type: DEFAULT_TYPE,
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: null,
  isFavorite: false,
  offers: []
};

const EVENTS = [
  'Bus',
  'Drive',
  'Flight',
  'Ship',
  'Taxi',
  'Train',
  'Check-in',
  'Restaurant',
  'Sightseeing'
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => futurePoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => presentPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => pastPoint(point)),
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const ButtonText = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  DELETING: 'Deleting',
  SAVE: 'Save',
  SAVING: 'Saving',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const NoPointsTextType = {
  NOPOINTS: 'Click New Event to create your first point',
  LOADING: 'Loading...',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const Sort = {
  [SortType.DAY]: (points) => [...points].sort(sortByDay),
  [SortType.TIME]: (points) => [...points].sort(sortByTime),
  [SortType.PRICE]: (points) => [...points].sort(sortByPrice),
};

export {
  EVENTS,
  TimeLimit,
  FilterType,
  filters,
  Mode,
  SortType,
  Sort,
  EMPTY_POINT,
  UserAction,
  NoPointsTextType,
  UpdateType,
  ButtonText,
  DISABLED_SORTS,
  Method,
  CITIES_LENGTH_BORDER,
  AUTHORIZATION,
  END_POINT
};
