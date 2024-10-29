import { styled } from "@mui/material";
import emStyled from "@emotion/styled";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const ImageInputContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ImageViewerContainer = styled(Box)`
  height: 128px;
  width: 128px;
  position: relative;
`;
export const ImageInputIconContainer = styled(Button)`
  position: absolute;
  z-index: 10;
  bottom: -2px;
  right: 4px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  width: 32px;
  min-width: 32px;
  height: 32px;
  min-height: 32px;
  border-radius: 50%;
`;
export const ImageViewer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.75);
`;
export const ImageInputLabel = emStyled.label`
  cursor: pointer;
`;
