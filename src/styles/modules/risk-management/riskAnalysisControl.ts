import { styled } from '@mui/material/styles';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { ArrowDown2, ArrowUp2, Edit, Trash, AddSquare, Add, ArrowCircleLeft } from 'iconsax-react';

/**
 * Risk Category Definition Styled Components
 * Classification: Confidential
 */

export const HazardLinkContainer = styled(Box)({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'start',
});

export const HazardLink = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  textDecoration: 'underline',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  cursor: 'pointer',
}));

export const HazardLinkDisabled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '18px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  textDecoration: 'underline',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  cursor: 'default',
  opacity: 0.5,
}));

export const AddHazardIconContainer = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  opacity: 1,
}));

export const AddHazardIconContainerDisabled = styled(Box)(({ theme }) => ({
  cursor: 'default',
  display: 'flex',
  opacity: 0.5,
}));

// QuestionField Styles
export const QuestionFieldContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const QuestionFieldContent = styled(Box)({
  flex: 1,
});

export const QuestionFieldDescriptionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasCheckbox',
})<{ hasCheckbox?: boolean }>(({ theme, hasCheckbox }) => ({
  marginLeft: hasCheckbox ? theme.spacing(2) : 0,
}));

// AddHazardModal Styled Components
export const LabelTypography = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  marginBottom: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}));

export const HarmToFieldContainer = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px',
  display: 'flex',
  minHeight: '63px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '15px',
  paddingBottom: '15px',
  gap: '40px 100px',
  fontSize: '16px',
  flexWrap: 'wrap',
}));

export const HarmToFieldContainerError = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid red',
  display: 'flex',
  minHeight: '63px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '15px',
  paddingBottom: '15px',
  gap: '40px 100px',
  fontSize: '16px',
  flexWrap: 'wrap',
}));

export const HarmToFieldContainerNormal = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px',
  border: `1px solid ${theme.palette.primary.main}`,
  display: 'flex',
  minHeight: '63px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '15px',
  paddingBottom: '15px',
  gap: '40px 100px',
  fontSize: '16px',
  flexWrap: 'wrap',
}));

export const ChipsContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '5px',
  justifyContent: 'start',
  flexWrap: 'wrap',
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '5px',
  padding: '5px 10px',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.text.primary,
  fontSize: '16px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

export const PlaceholderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '16px',
}));

export const EllipsisText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '16px',
}));

export const HiddenMultiSelectContainer = styled(Box)(({ theme }) => ({
  display: 'none',
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  color: 'red',
  fontSize: '14px',
  marginTop: '5px',
}));

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

// Form container with minimized spacing
export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
}));

// Individual field container with minimal margin
export const FieldContainer = styled(Box)(({ theme }) => ({
  marginBottom: '8px',
  width: '100%',
}));

// Hazard List Styled Components
export const HazardListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  borderRadius: '10px',
  overflow: 'hidden',
  justifyContent: 'start',
}));

export const HazardListHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '104px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '30px',
  paddingBottom: '30px',
  alignItems: 'flex-start',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
}));

export const HazardListTitle = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'flex-start',
  gap: '10px',
  fontSize: '24px',
  color: theme.palette.text.primary,
  fontWeight: '600',
  lineHeight: '1',
  justifyContent: 'start',
  flexWrap: 'nowrap',
  flex: 1,
  minWidth: 0,
}));

export const BackIconButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
}));

export const QuestionTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  alignSelf: 'flex-start',
  marginTop: 'auto',
  marginBottom: 'auto',
  minWidth: 0,
  flex: 1,
  fontWeight: 'bold',
}));

export const AddHazardButton = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: `1px solid ${theme.palette.primary.main}`,
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: '8px',
  marginBottom: 'auto',
  minHeight: '45px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  gap: '10px',
  overflow: 'hidden',
  fontSize: '18px',
  color: theme.palette.primary.main,
  fontWeight: '500',
  lineHeight: 'normal',
  justifyContent: 'start',
  textTransform: 'none',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  flexShrink: 0,
}));

export const AddButton = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: `1px solid ${theme.palette.primary.main}`,
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '45px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '8px',
  paddingBottom: '8px',
  gap: '10px',
  overflow: 'hidden',
  fontSize: '18px',
  color: theme.palette.primary.main,
  fontWeight: '500',
  lineHeight: 'normal',
  justifyContent: 'start',
  textTransform: 'none',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}));

export const HazardListContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '772px',
  width: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  justifyContent: 'start',
}));

export const HazardListInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '746px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
}));

export const HazardItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ theme, expanded }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  border: expanded ? `1px solid ${theme.palette.primary.main}` : 'none',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'stretch',
  justifyContent: 'start',
  marginBottom: '19px',
  overflow: 'hidden',
}));

export const HazardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  backgroundColor: theme.palette.background.default,
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '15px',
  paddingBottom: '15px',
  minHeight: '60px',
}));

export const HazardTitleSection = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.text.primary,
  fontWeight: '600',
  lineHeight: '1.2',
  justifyContent: 'start',
}));

export const HazardTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.text.primary,
  lineHeight: '1.2',
}));

export const HazardActionSection = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'end',
}));

export const ActionIconsContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingRight: '11px',
  paddingTop: '10px',
  paddingBottom: '10px',
  alignItems: 'center',
  gap: '15px',
  justifyContent: 'start',
}));

export const VerticalSeparator = styled(Box)(({ theme }) => ({
  width: '1px',
  height: '30px',
  backgroundColor: theme.palette.primary.light,
  marginLeft: '10px',
  marginRight: '10px',
}));

export const AddRiskButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.primary.main,
  fontWeight: '500',
  justifyContent: 'start',
  cursor: 'pointer',
}));

export const AddRiskButtonDisabled = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.text.disabled,
  fontWeight: '500',
  justifyContent: 'start',
  cursor: 'default',
  opacity: 0.6,
  pointerEvents: 'none',
}));

export const RiskListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  paddingLeft: '40px',
  paddingRight: '20px',
  paddingBottom: '5px',
  paddingTop: '5px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
  backgroundColor: theme.palette.background.paper,
}));

export const RiskHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '40px 80px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  paddingTop: '8px',
  paddingBottom: '8px',
  minHeight: '40px',
  backgroundColor: theme.palette.background.paper,
}));

export const RiskItem = styled(Box)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '14px',
  paddingBottom: '14px',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: '5px',
  marginBottom: '5px',
}));

export const RCMItem = styled(Box)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  display: 'flex',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '14px',
  paddingBottom: '14px',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: '5px',
  marginBottom: '5px',
}));

export const RiskTitleSection = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.text.primary,
  fontWeight: '600',
  lineHeight: '1.2',
  justifyContent: 'start',
}));

export const AddRCMButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: theme.palette.primary.main,
  fontWeight: '500',
  justifyContent: 'start',
  cursor: 'pointer',
}));

export const RCMListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '5px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
  paddingLeft: '7px',
  paddingRight: '20px',
}));

export const ExpandIcon = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  position: 'relative',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '32px',
  flexShrink: '0',
  cursor: 'pointer',
}));

export const ActionIcon = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  position: 'relative',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '21px',
  flexShrink: '0',
  cursor: 'pointer',
}));

export const ActionIconDisabled = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  position: 'relative',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '21px',
  flexShrink: '0',
  opacity: 0.5,
}));

export const AddIcon = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  position: 'relative',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '24px',
  flexShrink: '0',
}));

export const RCMActionContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  paddingRight: '11px',
  alignItems: 'center',
  gap: '15px',
  justifyContent: 'start',
}));

// Styled Icon Components
export const PrimaryArrowUpIcon = styled(ArrowUp2)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const PrimaryArrowDownIcon = styled(ArrowDown2)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const PrimaryEditIcon = styled(Edit)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const ErrorTrashIcon = styled(Trash)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const PrimaryAddSquareIcon = styled(AddSquare)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const PrimaryAddSquareIconDisabled = styled(AddSquare)(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

// Add Risk Modal Styles
export const AcceptabilityContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
}));

export const AcceptabilityButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 2,
  justifyContent: 'flex-end',
}));

export const AcceptableButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  borderColor: theme.palette.success.main,
  color: isSelected ? theme.palette.common.white : theme.palette.success.main,
  backgroundColor: isSelected ? theme.palette.success.main : theme.palette.common.white,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.success.dark : theme.palette.success.light,
    borderColor: theme.palette.success.main,
  },
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
}));

export const NotAcceptableButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  borderColor: theme.palette.error.main,
  color: isSelected ? theme.palette.common.white : theme.palette.error.main,
  backgroundColor: isSelected ? theme.palette.error.main : theme.palette.common.white,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.error.dark : theme.palette.error.light,
    borderColor: theme.palette.error.main,
  },
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 500,
}));

// HazardList Styled Components
export const BackArrowIcon = styled(ArrowCircleLeft)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const AddHazardIcon = styled(Add)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const AddHazardTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  height: '100vh',
}));