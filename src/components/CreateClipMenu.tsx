
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

import TextClipPage from "./TextClipPage";

const useStyles = makeStyles((theme: Theme) => createStyles({
  createClipButton: {
    height: "100%",
  }
}));

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Zoom ref={ref} {...props} />)
);


const CreateCilpMenu = ({showButton, className}: any) => {
  const classes = useStyles({});
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const [ openTextPage, setOpenTextPage ] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const createClipButtonsTemplate = Object.entries({
    "text": () => {
      setOpenTextPage(true);
    },
    "image": () => {},
    "file": () => {},
    "folder": () => {},
  });

  const createTextClip = (title?: string, body?: string) => {
    setOpenTextPage(false);
    console.log(`create text clip: ${JSON.stringify({
      title: title, body: body
    }, ["title", "body"], 4)}`);
  };

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
      <Box display="inline" style={{
            background: "#eee",
          }}>
        <GridList cols={2}
            cellHeight={100}
            style={{ width: "200px" }}>
          {createClipButtonsTemplate.map(([text, onClick]) => (
            <GridListTile key={text}>
              <Button fullWidth onClick={onClick}
                  className={classes.createClipButton}>
                {text}
              </Button>
            </GridListTile>
          ))}
        </GridList>
      </Box>
    </Menu>
    <TextClipPage open={openTextPage}
        onClose={() => { setOpenTextPage(false) }}
        onDone={createTextClip} />
  </React.Fragment>;
};

export default CreateCilpMenu;
