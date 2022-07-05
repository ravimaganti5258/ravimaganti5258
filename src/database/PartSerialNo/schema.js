
export const SERIAL_NUMBER = 'SerialNumber';

export const SerialNumber = {
    name: SERIAL_NUMBER,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        SerialNo: 'int?',
        ExpiryDate: 'serial?',
        LastSycnDate: 'date?'

    },
};