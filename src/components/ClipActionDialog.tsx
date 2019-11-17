
import { onClose } from "../actions/ClipActionDialog";

//@ts-ignore
import React from "react";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";

import { TransitionProps } from '@material-ui/core/transitions';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';

import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from '@material-ui/icons/Done';

const CLIP_ACTION_DIALOG_PROPERTIES = gql`
  query {
    components {
      clip_action_dialog {
        visible
        target
      }
    }
  }
`;

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
);


const ClipActionDialog = ({
      onInputBarClose, onInputChange, onInputDone,
      position, doneIcon = (<DoneIcon />),
      placeholder = "", value
}: any) => {
  const {
    data: {
      components: {
        clip_action_dialog: {
          visible,
          target,
        }
      }
    }
  } = useQuery(CLIP_ACTION_DIALOG_PROPERTIES);

  return <Dialog open={visible}
      onClose={onClose} fullWidth
      TransitionComponent={Transition}>
    <Container>
      <Grid container>
        <Grid item>
          <Button>
            Edit
          </Button>
        </Grid>
      </Grid>
    </Container>
  </Dialog>;
};

export default ClipActionDialog;
