import React from "react";
import classes from "./cropImageDialogPanel.module.css";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { GreenSwitch } from "./some";

const CropImageDialogPanel = ({
  imgSrc,
  setScale,
  setRotate,
  handleToggleAspectClick,
  aspect,
  onSelectFile,
}) => {
  const label = { inputProps: { "aria-label": "ratio active" } };

  /**zoom */
  const marks = [
    {
      value: 0,
      label: "50%",
    },
    {
      value: 50,
      label: "100%",
    },
    {
      value: 100,
      label: "200%",
    },
  ];

  /**rotate */
  const marksRotate = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 100,
      label: "180",
    },
  ];

  return (
    <>
      <div className={classes.box_settings}>
        <div className={classes.label_div}>
          <label htmlFor="scale-input">Маштаб: </label>
          <Box sx={{ width: 200 }}>
            <Slider
              aria-label="Always visible"
              defaultValue={50}
              step={1}
              marks={marks}
              disabled={!imgSrc}
              onChange={(e) => setScale((Number(e.target.value) * 2) / 100)}
            />
          </Box>
        </div>
        <div className={classes.label_div}>
          <label htmlFor="rotate-input">Наклон: </label>
          <Box sx={{ width: 200 }}>
            <Slider
              aria-label="Always visible"
              defaultValue={0}
              step={1}
              marks={marksRotate}
              disabled={!imgSrc}
              onChange={(e) => setRotate((Number(e.target.value) * 180) / 100)}
            />
          </Box>
        </div>
        <div className={classes.label_div}>
          <label htmlFor="aspect ratio">16:9 </label>
          <GreenSwitch
            {...label}
            disabled={!imgSrc}
            checked={aspect}
            onChange={(event) => handleToggleAspectClick(event.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default CropImageDialogPanel;
