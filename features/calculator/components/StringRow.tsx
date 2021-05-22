import { InstrumentString } from '../../../generated/instrument_pb';
import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ScaleLengthCell } from './ScaleLengthCell';
import { NoteCell } from './NoteCell';
import { OctaveCell } from './OctaveCell';
import { GaugeCell } from './GaugeCell';

export interface StringRowElement {
  instrumentString: InstrumentString.AsObject;
}

export function breakingColor(percentTension: number): string {
  if (percentTension > 1) {
    return '#C62828';
  } else if (percentTension > 0.9 && percentTension < 1) {
    return '#F44336';
  } else if (percentTension > 0.8 && percentTension < 0.9) {
    return '#EF6C00';
  } else if (percentTension > 0.7 && percentTension < 0.8) {
    return '#FF9800';
  } else {
    return '#64dd17';
  }
}

const useStyles = makeStyles((theme) => ({
  rowContainer: {
    padding: '2px',
    marginBottom: '6px',
  },
  rowItem: {
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const StringRow: React.FC<StringRowElement> = ({ instrumentString }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.rowContainer}>
      <Grid className={classes.rowItem} item xs={1}>
        {instrumentString.stringNumber}
      </Grid>
      <Grid className={classes.rowItem} item xs={2}>
        <ScaleLengthCell instrumentString={instrumentString} />
      </Grid>
      <Grid className={classes.rowItem} item xs={1}>
        <NoteCell instrumentString={instrumentString} />
      </Grid>
      <Grid className={classes.rowItem} item xs={1}>
        <OctaveCell instrumentString={instrumentString} />
      </Grid>
      <Grid className={classes.rowItem} item xs={1}>
        <GaugeCell instrumentString={instrumentString} />
      </Grid>
      <Grid className={classes.rowItem} item xs={1}>
        {instrumentString.brand}
      </Grid>
      <Grid className={classes.rowItem} item xs={2}>
        {instrumentString.tension}
      </Grid>
      <Grid
        className={classes.rowItem}
        item
        xs={2}
        style={{ color: breakingColor(instrumentString.stress) }}
      >
        <span>{instrumentString.breakingPoint.toFixed(2)}</span>
        &nbsp;
        <span>{`(${(instrumentString.stress * 100).toFixed(2)}%)`}</span>
      </Grid>
      <Grid className={classes.rowItem} item xs={1}>
        {instrumentString.frequency}
      </Grid>
    </Grid>
  );
};
