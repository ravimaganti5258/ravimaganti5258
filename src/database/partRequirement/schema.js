
export const PART_REQUIREMENT = 'PartRequirement';

export const PartRequirement = {
    name: PART_REQUIREMENT,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        ApprovalStatus: 'string?',
        ApprovalStatusId: 'int?',
        ApprovedQty: 'int?',
        AttachmentExists: 'int?',
        Description: 'string?',
        IsBOQRequest: 'int?',
        JobId: 'int?',
        Model: 'string?',
        ModelId: 'int?',
        PartId: 'int?',
        PartNo: 'string?',
        PartReqStatus: 'string?',
        PartRequestId: 'int?',
        PartRequestNo: 'string?',
        Quantity: 'int?',
        RequestStatusId: 'int?',
        WarehouseId: 'int?',
        WorkOrderId: 'int?',
        dataSyn: 'bool?'
    },
};