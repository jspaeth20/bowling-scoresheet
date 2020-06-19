import React, { useState } from 'react';
import GameStore from './stores/game-store';
import { makeStyles, Fab, Container } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BowlerList from './components/BowlerList';
import EditBowlerDialog from './dialogs/EditBowlerDialog';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 20,
    float: 'right',
  },
}));

function App(props: { game: GameStore }): JSX.Element {
  const { game } = props;
  const classes = useStyles();

  const [addBowlerDialogOpen, setAddBowlerDialogOpen] = useState(false);

  return (
    <div className='App'>
      <h2 className={classes.title}>Bowling Scoresheet</h2>

      <Container maxWidth='xl'>
        <BowlerList {...props} />

        <Fab
          color='primary'
          className={classes.addButton}
          title='add bowler'
          onClick={() => setAddBowlerDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Container>

      <EditBowlerDialog
        open={addBowlerDialogOpen}
        name='Player Name'
        onClose={(name) => {
          game.addBowler(name);
          setAddBowlerDialogOpen(false);
        }}
      />
    </div>
  );
}

export default App;
