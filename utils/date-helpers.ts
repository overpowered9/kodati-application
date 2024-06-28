import moment from 'moment';

export const formatDateTime = (date: Date): string => {
  return moment(date).format('DD/MM/YYYY hh:mm A');
}