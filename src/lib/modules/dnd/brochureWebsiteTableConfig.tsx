import { NUMBERMAP } from '@/constants/common';

export const columns = [
  { field: 'sno', headerName: 'S.No', flex: NUMBERMAP.HALF},
  { field: 'versionNumber', headerName: 'Version Number', flex: NUMBERMAP.ONE },
  { field: 'createdDate', headerName: 'Created Date', flex: NUMBERMAP.ONE },
  { field: 'status', headerName: 'Status', flex: NUMBERMAP.ONE },
  {
    field: 'action',
    headerName: 'Action',
    flex: NUMBERMAP.ONE,
  },
];

export const sampleRows = [

];
