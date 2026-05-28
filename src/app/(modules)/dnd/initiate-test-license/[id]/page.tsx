"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OuterContainer, InnerContainer, StyledButton, StyledTypography } from '@/styles/modules/dnd/manufacturingLicense';
import LicenseModal from '@/components/modules/dnd/license-modal/LicenseModal';
import { LICENSE_MESSAGES, TEST_LICENSE } from '@/constants/modules/dnd/manufacturingLicense';
import { useListLicense } from '@/hooks/modules/dnd/useTestLicense';
import { NUMBERMAP } from '@/constants/common';

const TestLicense = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const projectId = Number(params.id);
  const [isInitiated,setIsInitiated] = useState(false)
  const {data} = useListLicense(projectId,LICENSE_MESSAGES.TEST_LICENSE)

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  useEffect(()=>{
        if(data?.data){
          const responsedata = data.data
          const initiated = responsedata.length>NUMBERMAP.ZERO?responsedata[NUMBERMAP.ZERO]?.is_initiated:false
          setIsInitiated(initiated??false)
        }
    },[data])

  return (
  
    <OuterContainer>
      <InnerContainer>
        <StyledTypography>
          {TEST_LICENSE.TEST_LICENSE_TITLE}
        </StyledTypography>
        <StyledButton disabled={isInitiated} onClick={handleOpenModal}>{TEST_LICENSE.INITIATE_TEST_LICENSE}</StyledButton>
      </InnerContainer>
      <LicenseModal
        open={isModalOpen}
        projectId={projectId}
        onClose={handleCloseModal}
        licenseType={LICENSE_MESSAGES.TEST_LICENSE}
      />
    </OuterContainer>


  );
};

export default TestLicense;