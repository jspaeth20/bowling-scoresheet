import React from 'react';
import GameStore from '../stores/game-store';
import { observer } from 'mobx-react';
import { makeStyles, Grid, Container } from '@material-ui/core';
import ScoreTable from './ScoreTable';

const useStyles = makeStyles((theme) => ({
  bowlerCard: {
    margin: 10,
  },
}));

function BowlerList(props: { game: GameStore }): JSX.Element {
  const { game } = props;
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      {game.bowlers.map((bowler) => (
        <Grid item xs={12}>
          <ScoreTable bowler={bowler} />
        </Grid>
      ))}
    </Grid>
  );
}

export default observer(BowlerList);
