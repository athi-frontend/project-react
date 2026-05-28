import React, { useEffect, useRef } from 'react';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {
  StyledWrapper,
  StyledIconButton,
  StyledInfoIcon,
  StyledTooltipBox,
  StyledTooltipText,
  StyledCopyButton,
  StyledCopyWrapper,
  GreenTickIcon,
  GrayCopyIcon,
  InfoOverIndex,
} from '@/styles/components/ui/infoHover';
import { NUMBERMAP } from '@/constants/common';
interface InfoHoverProps {
  infoText: string;
}
const InfoHover: React.FC<InfoHoverProps> = ({ infoText }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [pinned, setPinned] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
    const domRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!pinned) setAnchorEl(event.currentTarget);
  };
  const handleMouseLeave = () => {
    if (!pinned) setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (pinned) {
      setPinned(false);
      setAnchorEl(null);
    } else {
      setPinned(true);
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClickAway = () => {
    if (pinned) {
      setPinned(false);
      setAnchorEl(null);
    }
  };
  const handleCopy = () => {
    copyHtmlFromElement()
  };
  const copyHtmlFromElement = async () => {
    if (!domRef.current) return;
    const html = domRef.current.outerHTML;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([domRef.current.innerText], { type: 'text/plain' }),
        }),
      ]);
      setCopied(true);
    } catch (err) {
      throw new Error(err);
    }
};

  useEffect(() => {
    if (!pinned) {
      setCopied(false);
    }
  }, [pinned]);
  const open = Boolean(anchorEl);
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <StyledWrapper>
        <StyledIconButton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <StyledInfoIcon size={NUMBERMAP.TWENTY} variant="Outline" />
        </StyledIconButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="left-start"
          disablePortal
          style={InfoOverIndex}
          modifiers={[{ name: 'offset', options: { offset: [NUMBERMAP.TEN, NUMBERMAP.ZERO] } }]}
        >
          <StyledTooltipBox pinned={pinned}>
            <StyledCopyWrapper>
              <StyledTooltipText ref={domRef} >{infoText}</StyledTooltipText>
              {pinned && (
                <StyledCopyButton onClick={handleCopy}>
                  {copied ? (
                    <GreenTickIcon size={NUMBERMAP.EIGHTEEN} />
                  ) : (
                    <GrayCopyIcon size={NUMBERMAP.EIGHTEEN} />
                  )}
                </StyledCopyButton>
              )}
            </StyledCopyWrapper>
          </StyledTooltipBox>
        </Popper>
      </StyledWrapper>
    </ClickAwayListener>
  );
};

export default InfoHover;
