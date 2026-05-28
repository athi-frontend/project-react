import { Theme } from '@mui/material/styles';
/**
      *Classification : Confidential
**/
export const designInputAdequacyStyles = {
  mainContainer: (theme: Theme) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '40px',
    paddingRight: '40px',
  }),

  titleContainer: {
    alignItems: 'stretch',
    borderRadius: '10px',
    display: 'flex',
    width: '100%',
    paddingTop: '30px',
    flexDirection: 'column',
  },

  dataGridContainer: {
    width: '100%',
    paddingBottom: '20px',
    '& .MuiDataGrid-root': {
      borderRadius: '10px',
      fontSize: '16px',
      '& .MuiDataGrid-columnHeaders': {
        borderRadius: '10px 10px 0 0',
        '& .MuiDataGrid-columnHeader': {
          fontSize: '16px',
        },
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        fontSize: '18px',
      },
      '& .MuiDataGrid-cell': {
        padding: '16px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiDataGrid-row': {
        minHeight: '120px !important',
        '& .MuiDataGrid-cell': {
          minHeight: '120px !important',
          alignItems: 'flex-start',
          paddingTop: '12px',
        },
      },
    },
  },

  textField: (theme: Theme) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      minHeight: '80px',
      '& fieldset': {
        borderColor: 'var(--Text-Disable, #999)',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      minWidth: '250px !important',
      paddingBottom: '12px',
    },
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.text.secondary,
    },
    '& .MuiFormHelperText-root': {
      minWidth: '250px !important',
      minHeight: '20px',
      marginTop: '4px',
    },
  }),

  snoColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '80px',
    textAlign: 'center',
  },

  adequateColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '80px',
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiFormGroup-root': {
      justifyContent: 'center',
      width: '100%',
    },
  },

  requirementsColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '80px',
    textAlign: 'center',
  },

  remarksColumn: {
    display: 'flex',
    alignItems: 'flex-start',
    height: '100%',
    minHeight: '8px',
    paddingTop: '8px',
    '& .MuiTextField-root': {
      width: '100%',
      '& .MuiInputBase-root': {
        minHeight: '80px',
      },
    },
  },

  conflictsClickable: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};