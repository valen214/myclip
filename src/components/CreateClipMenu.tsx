
import React, { useState, useEffect } from "react";

import { connect } from "react-redux";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Fab from '@material-ui/core/Fab';
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Zoom from "@material-ui/core/Zoom";
import { TransitionProps } from '@material-ui/core/transitions';

import AddIcon from "@material-ui/icons/Add";

import { getVisibilityController } from "../contexts/ComponentsVisibility";
import StaticComponents from "../constants/StaticComponents";

import { CreateClipMenuWrapper } from "../actions/CreateClipMenu";


const useStyles = makeStyles((theme: Theme) => createStyles({
  createClipButton: {
    height: "100%",
  }
}));

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Zoom ref={ref} {...props} />)
);


const CreateCilpMenu = ({
    className, createClip, onCreateTextClipButtonClick
}: any) => {
  const classes = useStyles({});
  const controller = getVisibilityController();
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const [ openTextPage, setOpenTextPage ] = useState(false);

  const create_clip_button_click = (
      e: React.MouseEvent<HTMLButtonElement>) => {
    controller.setVisible(StaticComponents.CREATE_CLIP_MENU, true);
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }

  const createClipButtonsTemplate = Object.entries({
    "text": onCreateTextClipButtonClick,
    "image": () => {},
    "file": () => {},
    "folder": () => {},
    "drawing": () => {},
    "webpage": () => {},
  });

  return <React.Fragment>
    <Fade in={controller.isVisible(StaticComponents.CREATE_CLIP_BUTTON)}>
      <Fab className={className} onClick={create_clip_button_click}>
        <AddIcon />
      </Fab>
    </Fade>
    <Menu
        keepMounted
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl) &&
            controller.isVisible(StaticComponents.CREATE_CLIP_MENU)}
        onClose={handleClose}
        TransitionComponent={Transition}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: "center", horizontal: "center" }}>
      <Box display="inline" style={{ background: "#eee" }}>
        <GridList cols={2}
            cellHeight={100}
            style={{ width: "200px" }}>
          {createClipButtonsTemplate.map(([text, onClick]) => (
            <GridListTile key={text}>
              <Button fullWidth onClick={() => {
                    setAnchorEl(null);
                    onClick();
                  }}
                  className={classes.createClipButton}>
                {text}
              </Button>
            </GridListTile>
          ))}
        </GridList>
      </Box>
    </Menu>
  </React.Fragment>;
};

export default CreateClipMenuWrapper(CreateCilpMenu);
