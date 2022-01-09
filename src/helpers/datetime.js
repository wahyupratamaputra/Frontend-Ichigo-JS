import moment from 'moment';

export const formatConvertedDateToString = (date)=>{
    return moment(date,'YYYY-MM-DD').format('DD MMMM YYYY');
}