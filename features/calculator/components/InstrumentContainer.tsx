import { useSnapshot } from 'valtio';
import { calculatorStore } from '../calculator.store';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
} from '@material-ui/core';
import {
  AddCircle,
  AddCircleOutline,
  RemoveCircleOutline,
} from '@material-ui/icons';
import { StringRow } from './StringRow';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: '8px',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  headerItem: {
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const InstrumentHeader = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.headerContainer}>
      <Grid className={classes.headerItem} item xs={1}>
        No.
      </Grid>
      <Grid className={classes.headerItem} item xs={2}>
        Scale Length
      </Grid>
      <Grid className={classes.headerItem} item xs={1}>
        Note
      </Grid>
      <Grid className={classes.headerItem} item xs={1}>
        Octave
      </Grid>
      <Grid className={classes.headerItem} item xs={1}>
        Gauge
      </Grid>
      <Grid className={classes.headerItem} item xs={1}>
        Brand
      </Grid>
      <Grid className={classes.headerItem} item xs={2}>
        Tension (lbs)
      </Grid>
      <Grid className={classes.headerItem} item xs={2}>
        Breaking Point (lbs) (t/bp %)
      </Grid>
      <Grid className={classes.headerItem} item xs={1}>
        Frequency
      </Grid>
    </Grid>
  );
};

export const InstrumentContainer = () => {
  const calculatorSnap = useSnapshot(calculatorStore);
  return (
    <Card>
      <CardContent>
        <InstrumentHeader />
        {calculatorSnap.strings.map((s) => (
          <StringRow
            instrumentString={s}
            key={`${s.stringNumber}${s.note}${s.octave}`}
          />
        ))}
      </CardContent>
      <CardContent>
        <Grid container>
          <Grid item xs={2}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-evenly"
            >
              <Button
                style={{ marginBottom: '8px' }}
                endIcon={<AddCircle />}
                variant="contained"
                onClick={() => calculatorStore.addString(false)}
                color="primary"
              >
                Add Lower String
              </Button>
              <Button
                style={{ marginBottom: '8px' }}
                endIcon={<AddCircleOutline />}
                variant="contained"
                onClick={() => calculatorStore.addString(true)}
                color="secondary"
              >
                Add Higher String
              </Button>
              <Button
                style={{ marginBottom: '8px' }}
                endIcon={<RemoveCircleOutline />}
                variant="outlined"
                onClick={() => calculatorStore.removeString()}
                disabled={calculatorSnap.strings.length === 0}
              >
                Remove String
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
