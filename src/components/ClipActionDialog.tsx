
//@ts-ignore
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../logic/rootReducer";
import {
  setVisible,
  setTarget,
} from "../logic/clipActionDialogSlice";
import {
  deleteClipItem
} from "../logic/clipItemSlice";

import {
    makeStyles, Theme, createStyles
} from "@material-ui/core/styles";
import { TransitionProps } from '@material-ui/core/transitions';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";


const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
    // mountOnEnter unmountOnExit
);


const useStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    width: "100%",
    height: 100,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
  },
  paper: {
    pointerEvents: "all",
  },
}));

const ClipActionDialog = ({}: any) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const {
    visible, target
  } = useSelector((state: RootState) => state.clipActionDialog);

  const onClose = React.useCallback(() => {
    dispatch(setVisible(false));
    dispatch(setTarget(""));
  }, [dispatch, visible, target]);

  return <Dialog fullWidth
      open={visible}
      TransitionComponent={Transition}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "100%",
          maxWidth: "none",
          margin: "0",
          position: "fixed",
          bottom: 0,
          left: 0,
          paddingBottom: 15,
        }
      }}>
    <Grid container>
      <Grid item>
        <Button>
          Edit
        </Button>
      </Grid>
      <Grid item>
        <Button>
          Share
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => {
              dispatch(deleteClipItem(target))
              onClose();
            }}>
          Delete
        </Button>
      </Grid>
    </Grid>
  </Dialog>
  ;
};

export default ClipActionDialog;
