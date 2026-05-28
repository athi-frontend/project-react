'use client'
import React, { useState } from 'react'
import { Grid2, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Label from '@/components/ui/label/Label'
import InputField from '@/components/ui/input-field/InputField'
import { PageHeaderProps } from '@/types/components/ui/pageHeader'
import { StyledButton, styles } from '@/styles/components/ui/button'
import { NUMBERMAP } from '@/constants/common'

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  actionButtons = [],
  customClassName,
}) => {
  const [searchInputValue, setSearchInputValue] = useState(searchValue)

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value)
    onSearchChange?.(value)
  }
  return (
    <Box sx={styles.container} className={customClassName}>
      <Grid2 container spacing={1} sx={styles.grid}>
        <Grid2 size={{ md: NUMBERMAP.SIX }}>
          <Label title={title} />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.SIX }} sx={styles.actionButtonContainer}>
          {showSearch && (
            <Box sx={styles.PR}>
              <InputField
                label=""
                placeholder={searchPlaceholder}
                value={searchInputValue}
                onChange={handleSearchChange}
                endAdornment={<SearchIcon sx={styles.SearchIcon} />}
              />
            </Box>
          )}
          {actionButtons.length > NUMBERMAP.ZERO && (
            actionButtons.map((button, index) =>
              <StyledButton
                sx={styles.MT}
                key={button.label}
                onClick={button.onClick}
                className={button.className}
              >
                {button.label}
              </StyledButton>
            )
          )}
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default PageHeader 