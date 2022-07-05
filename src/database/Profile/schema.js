export const USER_PROFILE = 'USER_PROFILE';

export const userProfile = {
    name: USER_PROFILE,
    primaryKey: 'id',
    properties: {
        id: 'string',
        CompanyId: 'int',
        DisplayName: 'string',
        FirstName: 'string',
        LastLogindatetime: 'string',
        LastName: 'string',
        LoginId: 'int',
        Phone1: 'string',
        Phone2: 'string',
        PhotoPath: 'string',
        ProfileImage: 'string',
        dataSync: 'bool?',
        LastSync: 'date?'
    },
};
