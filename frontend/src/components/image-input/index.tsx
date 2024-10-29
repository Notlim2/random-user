import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImageInputContainer,
  ImageInputLabel,
  ImageViewerContainer,
  ImageInputIconContainer,
  ImageViewer,
} from "./styles";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useTheme } from "@mui/material";

interface ImageInputProps {
  imgUrl: string | undefined;
  setFile: (file: File) => void;
  icon?: "product" | "user";
}

const ImageInput: React.FC<ImageInputProps> = ({
  imgUrl,
  setFile,
  icon = "user",
}) => {
  const theme = useTheme();
  const [dataUrl, setDataUrl] = useState("");
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      if (target.files?.length) {
        const reader = new FileReader();
        reader.onload = (r) => {
          if (r.target?.result) {
            setDataUrl(`${r.target?.result}`);
          }
        };
        reader.readAsDataURL(target.files[0]);
        setFile(target.files[0]);
        (target as unknown as { value: null }).value = null;
      }
    },
    [setFile]
  );
  const ImageInputIcon = useMemo(() => {
    if (icon === "user") {
      return PersonIcon;
    }
    return InventoryIcon;
  }, [icon]);
  useEffect(() => {
    if (imgUrl?.length) {
      setDataUrl(imgUrl);
    }
  }, [imgUrl]);
  return (
    <>
      <ImageInputContainer>
        <ImageInputLabel htmlFor="image-input">
          <ImageViewerContainer>
            <ImageViewer>
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="thumb"
                  style={{ maxWidth: "inherit", height: "100%" }}
                />
              ) : (
                <ImageInputIcon style={{ fontSize: theme.spacing(10) }} />
              )}
            </ImageViewer>
            <ImageInputIconContainer variant="contained" color="primary">
              <CameraAltIcon />
            </ImageInputIconContainer>
          </ImageViewerContainer>
        </ImageInputLabel>
      </ImageInputContainer>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        hidden
        onChange={handleInputChange}
      />
    </>
  );
};

export default ImageInput;
