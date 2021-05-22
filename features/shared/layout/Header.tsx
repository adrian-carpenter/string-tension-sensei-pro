import { Box, Button, makeStyles } from '@material-ui/core';
import { ClearAll } from '@material-ui/icons';
import { calculatorStore } from '../../calculator/calculator.store';
import React from 'react';
import { AboutModal } from './AboutModal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    padding: '12px',
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  titleEmphasis: {
    color: '#ff9800',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <AboutModal />
      <span className={classes.headerTitle}>
        String Tension S🐱‍👤nsei{' '}
        <span className={classes.titleEmphasis}>Pro</span>
      </span>
      <Box display="flex" flexDirection="row-reverse" alignItems="center">
        <Button
          variant="outlined"
          endIcon={<ClearAll />}
          onClick={() => calculatorStore.clearModifiers()}
        >
          Clear Modifiers
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
