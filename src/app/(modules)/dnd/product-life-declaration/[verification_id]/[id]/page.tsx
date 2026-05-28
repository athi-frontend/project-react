"use client";
import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import { RichTextEditor, DataTable, showActionAlert, Label, ActionButton } from "@/components/ui";
import { GridColDef } from "@mui/x-data-grid";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { Container, PageContainer } from "@/styles/common";
import LifeTimePopupForm from "../../LifetimeCalculationModal";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import { useGetProductDeclaration, usePostProductDeclaration } from "@/hooks/modules/dnd/useProductLifeDeclaration";
import { useParams, useRouter } from "next/navigation";
import { SUCCESS } from "@/constants/modules/dnd/pnd";
import { CriteriaData } from "@/types/modules/dnd/productLifeDeclaration";
import { NUMBERMAP, STATUS, BUTTONSTYLE } from "@/constants/common";
import { DELETE, PRODUCT_DECLARATION_COLUMNS, PRODUCT_LIFE_DECLARATION } from "@/constants/modules/dnd/productLifeDeclaration";
import { ID } from "@/constants/modules/hr/candidateEvaluation";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { FormSection } from "@/styles/modules/dnd/market";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import ReviewerModalManager from "@/components/modules/dnd/reviewer-modal/ReviewerModalManager";
import CommentsHistory from "@/components/ui/comments-history/Comments";

/**
 Classification : Confidential
**/

const ProductLifeDeclaration: React.FC<{ projectId: number }> = () => {
  const [conclusion, setConclusion] = useState("");
  const [lifeTime, setLifeTime] = useState(false);
  const [dirName, setDirName] = useState("");
  const [dirRef, setdirRef] = useState(NUMBERMAP.ZERO);
  const [criteriaData, setCriteriaData] = useState<CriteriaData[]>([]);
  const [editData, setEditData] = useState<CriteriaData | null>(null);
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const {verification_id , id} = useParams();
  const projectId = parseInt(id);
  const verificationId = parseInt(verification_id);
  const router = useRouter();

  // Use mutation for posting data
  const { mutate: postProductDeclarationMutation, isPending: isPosting } = usePostProductDeclaration();

  // Fetch data using useGetProductDeclaration
  const { data, isLoading, isFetching } = useGetProductDeclaration(verificationId);

  // Create loading function
  const isAnyLoading = () => {
    if (isLoading) return true;
    if (isFetching) return true;
    if (isPosting) return true;
    return false;
  };
  useEffect(() => {
    if (data?.data) {
      const responseData = data.data;
      setConclusion(responseData.conclusion);
      setDirName(responseData.dir_name ?? '-');
      setdirRef(responseData.dir_ref);

      const transformedCriteria: CriteriaData[] = responseData.lifetime_calculation_criteria.map((item) => ({
        ...item, 
        id: item.lifetime_id.toString(),
        partNo: item.part_no,
      }));
      setCriteriaData(transformedCriteria);
    }
  }, [data]);

  const handleEdit = (id: string) => {
    const criteriaToEdit = criteriaData.find((item) => item.id === id);
    if (criteriaToEdit) {
      setEditData(criteriaToEdit); 
      setLifeTime(true);
    }
  };

  const handleDelete = async (id: string) => {
    if(!hasEditPermission) return;
    const result = await showActionAlert(DELETE);
    if (result?.isConfirmed) {
      const updatedCriteria = criteriaData.filter((item) => item.id !== id);
      setCriteriaData(updatedCriteria);
    }
  };

  const handleCancel = () => {
    setConclusion("");
    setCriteriaData([]);
    setDirName("");
    setdirRef(NUMBERMAP.ZERO);
    router.push(PRODUCT_LIFE_DECLARATION.PATH);
  };

  const handleSave = async () => {
    const payload = {
      project_id: projectId,
      verification_plan_dir_id: verificationId,
      lifetime_calculation_criteria: criteriaData.map((item) => ({
        part_no: item.partNo,
        description: item.description,
        remarks: item.remarks,
      })),
      conclusion: conclusion,
    };

    postProductDeclarationMutation(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      },
    });
  };

  const handleAddCriteria = (newData: { partNo: string; description: string; remarks: string }) => {
    if(!hasEditPermission) return;
    if (editData) {
      // Update existing data
      const updatedCriteria = criteriaData.map((item) =>
        item.id === editData.id
          ? { ...item, partNo: newData.partNo, description: newData.description, remarks: newData.remarks }
          : item
      );
      setCriteriaData(updatedCriteria);
      setEditData(null); 
    } else if (newData.partNo.trim() || newData.description.trim() || newData.remarks.trim()) {
        const newId = (criteriaData.length + NUMBERMAP.ONE).toString();
        const newSno = (criteriaData.length + NUMBERMAP.ONE).toString();
        const newCriteria: CriteriaData = {
          id: newId,
          sno: newSno,
          partNo: newData.partNo,
          description: newData.description,
          remarks: newData.remarks,
        };
        setCriteriaData([...criteriaData, newCriteria]);
      
    }
    setLifeTime(false);
  };

  const handleAddClick = () => {
    if(!hasEditPermission) return;
    setLifeTime(true);
    setEditData(null);
  };

  const columns: GridColDef[] = [
    {
      field: PRODUCT_DECLARATION_COLUMNS.SNO.FIELD,
      headerName: PRODUCT_DECLARATION_COLUMNS.SNO.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: PRODUCT_DECLARATION_COLUMNS.PART_NO.FIELD,
      headerName: PRODUCT_DECLARATION_COLUMNS.PART_NO.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: PRODUCT_DECLARATION_COLUMNS.DESCRIPTION.FIELD,
      headerName: PRODUCT_DECLARATION_COLUMNS.DESCRIPTION.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: PRODUCT_DECLARATION_COLUMNS.REMARKS.FIELD,
      headerName: PRODUCT_DECLARATION_COLUMNS.REMARKS.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: PRODUCT_LIFE_DECLARATION.ACTIONS,
      headerName: PRODUCT_LIFE_DECLARATION.ACTION,
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params: any) => (
        <ActionButton onEdit={() => handleEdit(params.row.id)} onDelete={() => handleDelete(params.row.id)} />
      ),
    },
  ];


  return (
    <Container>
      <GlobalLoader loading={isAnyLoading()} />
      {data && (
        <>
      <PageContainer>
        <Label title={PRODUCT_LIFE_DECLARATION.TITLE} />
        <FormSection>
          <Grid2 container spacing={NUMBERMAP.FIVE}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InfoField label={PRODUCT_LIFE_DECLARATION.LABEL} value={dirName} />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InfoField label={PRODUCT_LIFE_DECLARATION.DIR_REF} value={dirRef} />
            </Grid2>
          </Grid2>
        </FormSection>
        </PageContainer>
        <CommonSharedTale
          title={PRODUCT_LIFE_DECLARATION.LIFETIME}
          pathName={PRODUCT_LIFE_DECLARATION.PATHNAME}
          hanldeClick={handleAddClick} 
          Table={
            <DataTable
              IdField={ID}
              rows={criteriaData}
              columns={columns}
              checkbox={false}
              loading={false}
              pagination={false}
            />
          }
        />
         <PageContainer>
        <FormSection>
          <Grid2 size={NUMBERMAP.SIX}>
            <RichTextEditor
              label={PRODUCT_LIFE_DECLARATION.CONCLUSION}
              value={conclusion ?? ""}
              onChange={setConclusion}
              placeholder={PRODUCT_LIFE_DECLARATION.INPUT_TEXT}
              disabled={!hasEditPermission}
            />
          </Grid2>
        </FormSection>
        <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
          <CommentsHistory comments={data?.meta_info?.task_info?.task_comments} />
          <ReviewerModalManager
            isLoading={isLoading}
            permissions={data?.meta_info?.action_control?.permissions ?? []}
            projectId={projectId}
            menuId={data?.meta_info?.action_control?.menuId}
            menuName={data?.meta_info?.action_control?.formName}
            taskId={data?.meta_info?.task_info?.task_id}
            customHandlers={{ 
              handleCancel: handleCancel,
              handleSave: handleSave,
              isDisabled: isPosting
            }}
            onPermissionChange={setHasEditPermission}
            reviewerList={data?.meta_info?.task_info?.reviewer_list}
          />
        </Grid2>
        </PageContainer>
        <CommonModal
          onClose={() => { setLifeTime(false); setEditData(null); }} 
          open={lifeTime}
          title={PRODUCT_LIFE_DECLARATION.LIFETIME}
        >
          <LifeTimePopupForm
            onClose={() => { setLifeTime(false); setEditData(null); }}
            onSave={handleAddCriteria}
            editData={editData} 
            hasEditPermission={hasEditPermission}
          />
        </CommonModal>
        </>
    )}
    </Container>
  );
};

export default ProductLifeDeclaration;