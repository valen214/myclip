
//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../logic/rootReducer";
import {
  setButtonVisible,
  setMenuVisible
} from "../logic/createClipMenuSlice"
import {
  setVisible as setTextClipPageVisible,
  setTarget as setTextClipPageTarget,
} from "../logic/textClipPageSlice";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Fab from '@material-ui/core/Fab';
import Fade from "@material-ui/core/Fade";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Zoom from "@material-ui/core/Zoom";
import { TransitionProps } from '@material-ui/core/transitions';

import AddIcon from "@material-ui/icons/Add";

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
  const dispatch = useDispatch();
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const {
    button_visible, menu_visible,
  } = useSelector((state: RootState) => state.createClipMenu);

  const create_clip_button_click = (
      e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setMenuVisible(true));
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    dispatch(setMenuVisible(false));
    setAnchorEl(null);
  }

  const createClipButtonsTemplate = Object.entries({
    "text": () => {
      dispatch(setTextClipPageVisible(true));
      dispatch(setTextClipPageTarget(""));
    },
    "image": () => {},
    "file": () => {},
    "folder": () => {},
    "drawing": () => {},
    "webpage": () => {},
    "from pasteboard": () => {},
  });

  return <React.Fragment>
    <Fade in={button_visible}>
      <Fab className={className} onClick={create_clip_button_click}>
        <AddIcon />
      </Fab>
    </Fade>
    <Menu
        keepMounted
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl) && menu_visible}
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

export default CreateCilpMenu;
