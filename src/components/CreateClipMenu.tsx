
import React, { useState, useEffect } from "react";

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
    <Box display="inline" style={{
        position: "absolute",
        top: "100px",
        background: "#eee",
      }}>
      <GridList cols={2}
          cellHeight={100}
          style={{ width: "200px" }}>
        {["text", "image", "file", "folder"].map(text => (
          <GridListTile>
            <Button fullWidth style={{ height: "100%" }}>
              {text}
            </Button>
          </GridListTile>
        ))}
      </GridList>
    </Box>
    <Fade in={showButton}>
      <Fab className={className}
          onClick={handleClick}>
        <AddIcon />
      </Fab>
    </Fade>
    <Menu
        keepMounted
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl) && showButton}
        onClose={handleClose}
        TransitionComponent={Transition}
        anchorOrigin={{
          vertical: 'center', horizontal: 'center',
        }}
        transformOrigin={{
          vertical: "center", horizontal: "center"
        }}>
        <div>HELLO </div>
    </Menu>
  </React.Fragment>;
};

export default CreateCilpMenu;
