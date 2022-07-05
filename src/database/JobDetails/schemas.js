export const JOB_LIST = 'JobList';
export const JOB_DETAILS = 'JobDetails';
export const TIME_OFF_REASON = 'TimeOffReasons[]';

export const TECHNICIAN_JOB_INFORMATION = 'TechnicianJobInformation[]';
export const CUSTOMER_TIME_ZONE = 'CustomertimeZone';
export const WORK_ORDER_CUSTOMER_CONTACT_DETAILS =
  'WorkOrderCustomerContactDetails';
export const WORK_JOB_DETAILS = 'WOJobDetails[]';
export const GET_WORK_ORDER_APPOINTMENT = 'GetWorkOrderAppointment';
export const GET_PROJECT_DETAILS = 'GetProjectDetails';
export const GET_SERVICE_NOTES_DETAILS = 'GetWojobServiceNotesDetails[]';
export const GET_WORK_JOB_SPL_INS_DETAILS = 'GetWojobSplInsDetails[]';

export const TechnicianJobInformation = {
  name: TECHNICIAN_JOB_INFORMATION,
  properties: {
    WorkOrderId: 'int?',
    WoNumber: 'string?',
    WoJobId: 'int?',
    JobNo: 'int?',
    ScheduleStartDateTime: 'string?',
    ScheduleEndDateTime: 'string?',
    JobStatusid: 'int?',
    JobStatus: 'string?',
    CustomerTypeId: 'int?',
    CustomerType: 'string?',
    ServiceAddressId: 'int?',
    BillingAddressId: 'int?',
    CustomerId: 'int?',
    CustomerName: 'string?',
    AddressName: 'string?',
    AddressTypeid: 'int?',
    AddressLine1: 'string?',
    AddressLine2: 'string?',
    UnitNo: 'string?',
    CityName: 'string?',
    ZipCode: 'string?',
    Phone1: 'string?',
    Phone2: 'string?',
    WoCategoryId: 'int?',
    WoCategory: 'string?',
    WorkRequestCount: 'int?',
    Days: 'int?',
    Hours: 'int?',
    Minutes: 'int?',
    IsPmOrder: 'int?',
    TechDisplayName: 'string?',
    Zone: 'string?',
    Region: 'string?',
    JobDescription: 'string?',
    ApptPrefDate: 'string?',
    ApptPrefTime: 'string?',
    FirstName: 'string?',
    LastName: 'string?',
    WoStatus: 'string?',
    TechId: 'int?',
    UserLat: 'float?',
    UserLon: 'float?',
    ZipLat: 'float?',
    ZipLon: 'float?',
    MapLat: 'float?',
    MapLon: 'float?',
    CreatedBy: 'int?',
    SLAStartTime: 'string?',
    SLAEndTime: 'string?',
    CreatedDate: 'string?',
    TechTimeZoneId: 'int?',
    WoAddressId: 'int?',
    CustContactId: 'int?',
    SubmittedByUserId: 'int?',
    SubmittedDate: 'string?',
    SubmittedSource: 'int?',
    CustAddressId: 'int?',
    CusTimeZoneId: 'int?',
    CustomPanel: 'int?',
    PanelName: 'int?',
    VendorId: 'int?',
    SlotStartTime: 'string?',
    SlotEndTime: 'string?',
    AcctualAddress: 'string?',
    StateShortName: 'string?',
    CountryName: 'string?',
    SlotStartTimeval: 'string?',
    SlotEndTimeval: 'string?',
    DBShortCode: 'string?',
    Duration: 'int?',
    SlaDays: 'string?',
    SlaHours: 'int?',
    SlaMinutes: 'int?',
    Durationstr: 'string?',
    PriorityName: 'string?',
    RequestedBy: 'string?',
    IsSLAMet: 'int?',
    SchedulStartDateTime: 'string?',
    ProjectName: 'string?',
    VendorName: 'string?',
    TimeZoneCode: 'string?',
    ResponseSLAStartTime: 'string?',
    ResponseSLAEndTime: 'string?',
    IsResponseSLAMet: 'int?',
    ResponseDuration: 'int?',
    ResponseSlaDays: 'string?',
    ResponseSlaHours: 'string?',
    ResponseSlaMinutes: 'string?',
    Frequency: 'string?',
    PMEndDate: 'string?',
    PMStartDate: 'string?',
    IsAccept: 'int?',
    JobApprovalStatusId: 'int?',
    VendorApprovalStatusId: 'int?',
    vendordapprovedate: 'string?',
    ApprovalStatus: 'string?',
    ColorCode: 'string?',
    IsCompanyUserRejected: 'string?',
    Ishold: 'bool?',
  },
};

export const JobDetails = {
  name: JOB_DETAILS,
  primaryKey: 'id',
  properties: {
    id: 'int?',
    CompletedStatusReasons: { type: 'string', optional: true },
    TechnicianJobInformation: { type: 'string', optional: true },
    utcOffset: 'string?',
    CustomFields: { type: 'string', optional: true },
    CustomertimeZone: { type: 'string', optional: true },
    GetAllAttachment: { type: 'string', optional: true },
    GetAllCheckListAttachment: { type: 'string', optional: true },
    GetCustomerFeedback: { type: 'string', optional: true },
    GetDynamicChecklist: { type: 'string', optional: true },
    GetJobEquipment: { type: 'string', optional: true },
    GetJobPaymentDetailsEntity: { type: 'string', optional: true },
    GetPriceDetailsEntity: { type: 'string', optional: true },
    GetProjectDetails: { type: 'string', optional: true },
    GetTechnicianRemarks: { type: 'string', optional: true },
    GetWOJobChecklist: { type: 'string', optional: true },
    GetWOJobSignature: { type: 'string', optional: true },
    GetWojobServiceNotesDetails: { type: 'string', optional: true },
    GetWojobSplInsDetails: { type: 'string', optional: true },
    GetWorkOrderAppointment: { type: 'string', optional: true },
    IncidentDetails: { type: 'string', optional: true },
    JobApprovalStatus: { type: 'string', optional: true },
    OTPEnable: { type: 'string', optional: true },
    OTPTypeId: { type: 'string', optional: true },
    SLADetails: { type: 'string', optional: true },
    WOJobDetails: { type: 'string', optional: true },
    WorkOrderCustomerContactDetails: { type: 'string', optional: true },
    utcOffset: { type: 'string', optional: true },
    GetPartWarehouse: { type: 'string', optional: true },
    GetJobStatusTimeLine: { type: 'string', optional: true },
    GetPartRequestList: { type: 'string', optional: true },
    GetAllPartRequestEntity: { type: 'string', optional: true },
  },
};

// utcOffset: 'string?',
// TechnicianJobInformation: {
//   type: 'list',
//   objectType: TECHNICIAN_JOB_INFORMATION,
// },
