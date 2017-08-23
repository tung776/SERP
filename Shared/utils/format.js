import accounting from './accounting';

export const formatMoney = (value) => {
    return accounting.formatMoney(value, {
        symbol: 'VNĐ',
        format: '%v %s',
        decimal: '.',
        thousand: ' ',
        precision: 0
    });
};
export const formatNumber = (value) => {
    return accounting.formatNumber(value, {
        decimal: '.',
        thousand: ' ',
        precision: 0
    });
};
export const unformat = (value) => {
    return accounting.unformat(value);
};