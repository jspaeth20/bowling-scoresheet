import React from 'react';
import GameStore, { Bowler } from '../stores/game-store';
import {
  Table,
  makeStyles,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  ButtonGroup,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import { observer } from 'mobx-react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  tableCell: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    textAlign: 'center',
  },
  rollEditor: {
    textAlign: 'center',
  },
  bowlerName: {
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    fontSize: 16,
  },
}));

function ScoreTable(props: { game: GameStore; bowler: Bowler }): JSX.Element {
  const { bowler, game } = props;
  const classes = useStyles();

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableCell}>Name</TableCell>
          {bowler.frames.map((_, idx) => (
            <TableCell
              className={classes.tableCell}
              colSpan={idx === 9 ? 3 : 2}
            >
              Frame {idx + 1}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          {/* Player Name and Actions */}
          <TableCell
            className={clsx(classes.tableCell, classes.bowlerName)}
            rowSpan={2}
          >
            {/* Bowler Name */}
            <p>{bowler.name}</p>

            {/* Bowler Actions */}
            <ButtonGroup variant='text'>
              <IconButton
                size='small'
                color='default'
                onClick={() => bowler.clearFrames()}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton
                size='small'
                color='default'
                onClick={() => game.removeBowler(bowler.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          </TableCell>

          {/* Frame Values */}
          {bowler.frames.map((frame, idx) => [
            <TableCell className={classes.tableCell}>
              <TextField
                inputProps={{ style: { textAlign: 'center' } }}
                value={frame.roll1 === null ? '' : frame.roll1}
                onChange={(event) => {
                  frame.setRoll1(parseInt(event.target.value));
                  bowler.updateScore();
                }}
              ></TextField>
            </TableCell>,
            <TableCell className={classes.tableCell}>
              <TextField
                inputProps={{ style: { textAlign: 'center' } }}
                value={frame.roll2 === null ? '' : frame.roll2}
                onChange={(event) => {
                  frame.setRoll2(parseInt(event.target.value));
                  bowler.updateScore();
                }}
              ></TextField>
            </TableCell>,
          ])}

          {/* Frame 10 Last Value */}
          <TableCell className={classes.tableCell}>
            <TextField
              inputProps={{ style: { textAlign: 'center' } }}
              value={
                bowler.frames[bowler.frames.length - 1].roll3 === null
                  ? ''
                  : bowler.frames[bowler.frames.length - 1].roll3
              }
              onChange={(event) => {
                bowler.frames[bowler.frames.length - 1].setRoll3(
                  parseInt(event.target.value)
                );
                bowler.updateScore();
              }}
            ></TextField>
          </TableCell>
        </TableRow>

        {/* Frame Scores */}
        <TableRow>
          {bowler.frames.map((frame, idx) => (
            <TableCell
              className={classes.tableCell}
              colSpan={idx === 9 ? 3 : 2}
            >
              Score: {frame.score}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default observer(ScoreTable);
