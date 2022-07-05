
export const PART_LOOKUP_LIST = 'PartLookUpList';

export const PartLookUpList = {
    name: PART_LOOKUP_LIST,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        AttachmentExists: 'int?',
        Brand: 'string?',
        BrandId: 'int?',
        Category: 'string?',
        Description: 'string?',
        IsActive: 'int?',
        IsSerialized: 'int?',
        Model: 'string?',
        ModelId: 'int?',
        MovingCost: 'int?',
        PartId: 'int?',
        PartNo: 'string?',
        PartType: 'string?',
        TaxIdGroupId: 'int?',
        TaxTypeId: 'int?',
        UnitPrice: 'int?',
        Uom: 'string?',
        UomId: 'int?',
        LastSycnDate: 'date?'

    },
};