import { Box, Grid2 } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import StepperComponent from '@/components/ui/stepper/StepperComponent';
import { buildUnifiedDynamicStepperSections } from '@/lib/utils/dynamicStepper';
import { IGNOREPATHS, LAYOUTIGNOREBROUCHER, LAYOUTIGNOREPATHS, NUMBERMAP, PROJECT_DETAILS_ID_REGEX } from '@/constants/common';
import { useDispatch, useSelector } from 'react-redux';
import { getDecisionName, setDecision } from '@/store/slices/decisionSlice';
import { selectMenuData, setMenuData } from '@/store/slices/menuSlice';
import { useFeasibilityStudyDecision } from '@/hooks/modules/dnd/useFeasibilityStudy';
import { useEffect, useState } from 'react';
import { useUserAccess } from '@/hooks/modules/dnd/useProject';

/**
    Classification : Confidential
**/
interface CommonLayoutProps {
  children: React.ReactNode;
  useDecisionHooks?: boolean;
  useProjectId?: boolean;
}

export default function CommonLayout({
  children,
  useDecisionHooks = false,
  useProjectId = false,
}: Readonly<CommonLayoutProps>) {
  const [topLevel, setTopLevel] = useState<string | null>("");
  const pathname = usePathname();
  const { id: Project_Id } = useParams();
  const decision_name = useSelector(getDecisionName);
  const menuData = useSelector(selectMenuData);
  const extractedProjectId = useProjectId && Project_Id ? Number(Project_Id) : null;
  const { data: decision } = useFeasibilityStudyDecision(extractedProjectId);
  const dispatch = useDispatch();
  const { data: userAccess } = useUserAccess("project", extractedProjectId ? Number(extractedProjectId) : NUMBERMAP.ZERO);

  useEffect(() => {
    if (pathname) {
      const segment = pathname.split('/')[NUMBERMAP.ONE]; // skip the leading empty string
      setTopLevel(segment);
    }
  }, [pathname]);
  useEffect(() => {
    if (useDecisionHooks && userAccess?.data?.menus) {
      dispatch(setMenuData(userAccess.data.menus));
    }
  }, [userAccess, dispatch, useDecisionHooks]);

  const shouldIgnore = [
    () => IGNOREPATHS.includes(pathname),
    () => pathname.startsWith(LAYOUTIGNOREPATHS),
    () => pathname.startsWith(LAYOUTIGNOREBROUCHER),
    () => PROJECT_DETAILS_ID_REGEX.test(pathname),
  ].some(fn => fn());

  useEffect(() => {
    if (useDecisionHooks && decision?.decisions) {
      if (decision.decisions.length > NUMBERMAP.ZERO) {
        const selected = decision.decisions.find((des: any) => des.selected);
        if (selected) {
          dispatch(
            setDecision({
              decision_id: selected.decision_id,
              decision_name: selected.decision,
            })
          );
        }else{
          dispatch(
            setDecision({
              decision_id: NUMBERMAP.ZERO,
              decision_name: '',
            })
          );
        }
      }
    }
  }, [decision, useDecisionHooks, dispatch]);
  const ProdId =   useProjectId ? Project_Id : ''
  return shouldIgnore ? (
    <>{children}</>
  ) : (
    <Box>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={NUMBERMAP.TWO}>
          <StepperComponent
            sections={menuData.length > NUMBERMAP.ZERO
              ? buildUnifiedDynamicStepperSections(
                  menuData, 
                  topLevel ?? '', 
                  ProdId, 
                  decision_name, 
                  "/"+topLevel
                )
              : []
            }
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TEN}>{children}</Grid2>
      </Grid2>
    </Box>
  );
} 