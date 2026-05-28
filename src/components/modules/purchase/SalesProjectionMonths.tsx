import React from 'react'
import { Grid2, Typography } from '@mui/material'
import {
  MonthStrip,
  MonthCard,
  MonthHeader,
  MonthList,
  EmptyStateContainer,
  EmptyStateText,
  MonthHeaderText,
} from '@/styles/modules/purchase/salesProjection'
import { SalesProjectionMonthsProps } from '@/types/modules/purchase/salesProjection'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification : Confidential
 **/

const SalesProjectionMonths: React.FC<SalesProjectionMonthsProps> = ({
  salesProjections,
  isLoading,
  formatItem,
}) => {
  const renderItems = (items) => {
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (items.length === NUMBERMAP.ZERO) {
    return <EmptyStateText>No data available</EmptyStateText>;
  }

  return items.map((item: any, index: number) => (
    <Typography key={crypto.randomUUID()}>{formatItem(item)}</Typography>
  ));
};

  return (
    <MonthStrip>
      {salesProjections.length === NUMBERMAP.ZERO && !isLoading ? (
        <EmptyStateContainer>
          <EmptyStateText>No sales projection data available</EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <Grid2 container spacing={NUMBERMAP.ONE}>
          {
            salesProjections.map((months, projectionIndex) => {
              const monthKeys = Object.keys(months)

              if (monthKeys.length === NUMBERMAP.ZERO) {
                return (
                  <EmptyStateContainer key={crypto.randomUUID()}>
                    <EmptyStateText>No data available</EmptyStateText>
                  </EmptyStateContainer>
                )
              }

              return monthKeys.map((monthKey) => {
                const items = months[monthKey as keyof typeof months] ?? []
                return (
                  <MonthCard size={NUMBERMAP.FOUR} key={`${projectionIndex}-${monthKey}`}>
                    <MonthHeader>
                      <MonthHeaderText>{monthKey.toUpperCase()}</MonthHeaderText>
                    </MonthHeader>
                    <MonthList>
                      {renderItems(items)}
                    </MonthList>
                  </MonthCard>
                )
              })
            })
          }
        </Grid2>
      )}
    </MonthStrip>
  )
}

export default SalesProjectionMonths

