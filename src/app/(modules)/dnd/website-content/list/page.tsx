'use client';
import React from 'react';
import { DataGridTable } from '@/components/ui';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { PageContainer } from '@/styles/common';
import { columns, sampleRows } from '@/lib/modules/dnd/brochureWebsiteTableConfig';

const WebsiteContent: React.FC = () => {
  return (
    <PageContainer>
      <CommonSharedTale
        title="View Website Content"
        pathName="/dnd/brochure-content/brochure/create"
        Table={
          <DataGridTable
            rows={sampleRows}
            columns={columns}
            idField="id"
          />
        }
      />
    </PageContainer>
  );
};

export default WebsiteContent;
