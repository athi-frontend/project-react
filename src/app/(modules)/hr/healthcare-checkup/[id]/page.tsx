"use client";
import React from "react";
import { PageContainer } from "@/styles/modules/hr/healthDeclaration";
import HealthCheckupDeclaration from "@/components/modules/hr/health/HealthCheckupDeclaration";
import { P20P40, TableContainer } from "@/styles/common";

const HealthCheckupDeclarationPage: React.FC = () => {
/**
*Classification : Confidential
**/
  return (
    <TableContainer>
      <PageContainer sx={P20P40}>
        <HealthCheckupDeclaration  />
      </PageContainer>
    </TableContainer>
  );
};

export default HealthCheckupDeclarationPage;