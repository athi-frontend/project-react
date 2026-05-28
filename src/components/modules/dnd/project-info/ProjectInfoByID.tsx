import React from 'react';
import { useProjectInfo } from '@/hooks/modules/dnd/useProject';
import { useParams } from 'next/navigation';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { COMMON_CONSTANTS } from '@/lib/utils/common';
import dynamic from 'next/dynamic';
import { NUMBERMAP } from '@/constants/common';

/**
 Classification : Confidential
**/
const { FAILED_ALERT } = COMMON_CONSTANTS;
const ProjectInfo = dynamic(
  () => import('@/components/modules/dnd/project-info/ProjectInfo'),
  { ssr: false }
);

function ProjectInfoByID() {
  const searchParams = useParams();
  const { id } = searchParams;
  const { data: projectInfo, isError: projectInfoError, isLoading: isProjectDataLoading } = useProjectInfo(
    Number(id)
  );
  if (projectInfoError || !id) {
    showActionAlert(FAILED_ALERT);
  }

  return <ProjectInfo projectFormData={projectInfo?.data.length > NUMBERMAP.ZERO ? projectInfo?.data[NUMBERMAP.ZERO] : {}} isDataLoading = {isProjectDataLoading}  />;
}

export default ProjectInfoByID; 