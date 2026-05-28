"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OuterContainer, InnerContainer, StyledButton, StyledTypography } from '@/styles/modules/dnd/manufacturingLicense';
import LicenseModal from '@/components/modules/dnd/license-modal/LicenseModal';
import { useListLicense } from '@/hooks/modules/dnd/useTestLicense';
import { NUMBERMAP } from '@/constants/common';

const ManufacturingLicense = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitiated,setIsInitiated] = useState(false)
  const params = useParams();
  const projectId = Number(params.id);
  const {data} = useListLicense(projectId,"manufacturing_license")

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
          Apply for Manufacturing License
        </StyledTypography>
        <StyledButton disabled={isInitiated} onClick={handleOpenModal}>Initiate Manufacturing License</StyledButton>
      </InnerContainer>
      <LicenseModal
        open={isModalOpen}
        projectId={projectId}
        onClose={handleCloseModal}
        licenseType={"manufacturing_license"}
      />
    </OuterContainer>
  );
};

export default ManufacturingLicense;