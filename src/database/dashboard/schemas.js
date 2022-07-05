export const DASHBOARD_DATA = 'DASHBOARD_DATA';

export const Dashboard = {
    name: DASHBOARD_DATA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        AmountCollectedJob: 'int?',
        InProgressJobs: 'int?',
        OverdueJobs: 'int?',
        Todayjobs: 'int?',
        TotalAmounttobepaidjobs: 'int?',
        TotalPartRequestJobs: 'int?',
        UpcommingJobs: 'int?',
        WaitingAllocationJobs: 'int?',
        WaitingforSubmissionJobs: 'int?',
    },
};

