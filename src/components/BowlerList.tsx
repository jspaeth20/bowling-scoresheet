import React from 'react';
import GameStore from '../stores/game-store';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import ScoreTable from './ScoreTable';

function BowlerList(props: { game: GameStore }): JSX.Element {
  const { game } = props;

  return (
    <Grid container spacing={3}>
      {game.bowlers.map((bowler) => (
        <Grid item xs={12}>
          <ScoreTable game={game} bowler={bowler} />
        </Grid>
      ))}
    </Grid>
  );
}

export default observer(BowlerList);
