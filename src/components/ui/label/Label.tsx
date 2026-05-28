import { HeaderContainer, HeaderTitle } from '@/styles/components/ui/label'
interface HeaderProps {
  title: string
  stageNumber?: number
}

const Label: React.FC<HeaderProps> = ({ title, stageNumber }) => {
  return (
    <HeaderContainer>
      <HeaderTitle variant="h1">
        {stageNumber ? `${title} ${stageNumber}` : title}
      </HeaderTitle>
    </HeaderContainer>
  )
}

export default Label