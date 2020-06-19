import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  makeStyles,
  DialogActions,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialogButtons: {
    marginTop: 20,
  },
}));

type BowlerDialogProps = {
  open: boolean;
  name: string;
  onClose: (name: string) => void;
};

function EditBowlerDialog(props: BowlerDialogProps): JSX.Element {
  const { open, name, onClose } = props;
  const [newName, setNewName] = useState(name);
  const classes = useStyles();

  return (
    <Dialog open={open} fullWidth maxWidth='sm'>
      <DialogTitle>Add Bowler</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label='Name'
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onFocus={(event) => event.target.select()}
          onKeyPress={(target) => {
            if (target.charCode === 13) {
              onClose(newName);
            }
          }}
        />
        <DialogActions className={classes.dialogButtons}>
          <Button color='primary' onClick={() => onClose(newName)}>
            Save
          </Button>
          <Button color='primary' onClick={() => onClose(name)}>
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default EditBowlerDialog;
