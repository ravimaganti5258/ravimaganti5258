export const TIME_OFF_HISTORY = 'TimeOffHistory';

export const TimeOffHistory = {
  name: TIME_OFF_HISTORY,
  primaryKey: 'id',
  properties: {
    id: 'int?',
    TechOffTimeQueueId: 'int?',
    LeaveType: 'string?',
    LeaveTypeId: 'int?',
    Days: 'int?',
    Hours: 'int?',
    StartTime: 'string?',
    EndTime: 'string?',
    Reason: 'string?',
    ReasonId: 'int?',
    Status: 'string?',
    StatusId: 'int?',
    AppliedOn: 'string?',
    RejectedBy: 'string?',
    RejectedDate: 'string?',
    ApprovedBy: 'string?',
    ApprovedOn: 'string?',
    ApprovedRemarks: 'string?',
    RejectedRemarks: 'string?',
    LastSycnDate: 'date?',
    Sync: 'bool?'
  },
};
