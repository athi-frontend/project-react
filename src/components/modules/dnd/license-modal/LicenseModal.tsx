"use client";
import { useState } from 'react';
import { Box, Modal, Button } from '@mui/material';
import PinInputGroup from '@/components/modules/user/UpdatePin';
import { ErrorTypography,  modalContainerSx, buttonGroupSx, buttonSx, modaloverlay, CloseButtonContainer } from '@/styles/modules/dnd/manufacturingLicense';
import { useInitiateTestLicense } from '@/hooks/modules/dnd/useTestLicense';
import { BUTTONS, LICENSE_MESSAGES } from '@/constants/modules/dnd/manufacturingLicense';
import CloseIcon from '@mui/icons-material/Close'
import {CloseButton} from '@/styles/components/ui/modal'
import { STATUS } from '@/constants/common';
import { ERROR_COLOR } from '@/styles/common';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
/**
 Classification : Confidential
**/

interface TestLicenseModalProps {
  open: boolean;
  projectId: number;
  onClose: () => void;
  licenseType:string;
}

const LicenseModal = ({ open, projectId, onClose, licenseType }: TestLicenseModalProps) => {
  const [pinValue, setPinValue] = useState(['', '', '', '']);
  const [validationError, setValidationError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: initiateLicense } = useInitiateTestLicense();
  const handleSaveModal = () => {
    const isPinValid = pinValue.every(digit => digit !== '');
    if (isPinValid) {
      const pin = pinValue.join('');
      setValidationError('');
      initiateLicense(
        { project_id: projectId, verify_pin: pin, license_type: licenseType },
        {
          onSuccess: () => {
            showActionAlert(LICENSE_MESSAGES.SUCCESS_ALERT);
            onClose();
            setPinValue(['', '', '', '']);
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.description ?? STATUS.FAILED;
            setErrorMessage(errorMessage);
          },
        }
      );
    } else {
      setValidationError(LICENSE_MESSAGES.VALIDATION_ERROR);
    }
  };

  const handlePinChange = (newValue: string[]) => {
    setPinValue(newValue);
    if (validationError && newValue.every(digit => digit !== '')) {
      setValidationError('');
    }
    if (newValue.some(digit => digit !== '')) {
      setErrorMessage('');
    }
  };

  const handleClose = () => {
    onClose();
    setPinValue(['', '', '', '']);
    setValidationError('');
    setErrorMessage('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={modaloverlay}
    >
      <Box sx={modalContainerSx}>
         <CloseButtonContainer>
           <CloseButton onClick={handleClose}>
             <CloseIcon />
           </CloseButton>
         </CloseButtonContainer>
        <Box>
          <PinInputGroup
            label={LICENSE_MESSAGES.PIN_INPUT_LABEL}
            value={pinValue}
            onChange={handlePinChange}
          />
          {errorMessage && (
            <div style={ERROR_COLOR}>{errorMessage}</div>
          )}
          {validationError && (
            <ErrorTypography>
              {validationError}
            </ErrorTypography>
          )}
        </Box>
        <Box sx={buttonGroupSx}>
          <Button
            variant= {LICENSE_MESSAGES.OUTLINED}
            onClick={handleClose}
            sx={buttonSx}
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            variant= {LICENSE_MESSAGES.CONTAINED}
            onClick={handleSaveModal}
            sx={buttonSx}
          >
            {BUTTONS.SAVE}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LicenseModal;