
import React, { useState, useEffect } from "react";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Fab from '@material-ui/core/Fab';
import Fade from "@material-ui/core/Fade";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Zoom from "@material-ui/core/Zoom";
import { TransitionProps } from '@material-ui/core/transitions';

import AddIcon from "@material-ui/icons/Add";


const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Zoom ref={ref} {...props} />)
);


const CreateCilpMenu = ({showButton, className}: any) => {
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  return <React.Fragment>
    <Fade in={showButton}>
      <Fab className={className}
          onClick={handleClick}>
        <AddIcon />
      </Fab>
    </Fade>
    <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && showButton}
        onClose={handleClose}
        TransitionComponent={Transition}>
      <MenuItem>
        <Button>Hello!</Button>
      </MenuItem>
    </Menu>
  </React.Fragment>;
};

export default CreateCilpMenu;
