export const trainingEvaluationStyles = {
  expandableRow: {
    cursor: 'pointer',
    color: 'primary.main',
    textDecoration: 'underline',
  },
  expandedRow: {
    background: '#f5f5f5',
  },
  hiddenInputs: {
    display: 'none',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  skillRow: {
    width: '100%',
  },
  tableCell: (width: number) => ({
    textAlign: 'left',
    width: width,
    minWidth: width,
    maxWidth: width,
  }),
  tableHead: {
    border: '1px solid var(--Default-stroke, #D8D8D8)',
    backgroundColor: 'inherit',
    color: 'inherit',
  },
  tableHeaderCell: {
    fontSize: '16px',
    fontWeight: 500,
  },
  noRecordFoundCell: {
    textAlign: 'center',
    padding: '40px 0',
  },
  expandedTableCell: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  collapseBox: {
    margin: 1,
  },
  tableRow: {
    '& > *': { borderBottom: 'unset' },
  },

} as const; 