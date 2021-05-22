import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import {
  calculateStringCountOptions,
  calculateTuningOptions,
} from '../utils/instrument.utils';
import React, { useState } from 'react';
import { tuningTypeOptions } from '../constants/tuning';
import { Alert } from '@material-ui/lab';
import {
  stringCountOptionsBassDBL,
  stringCountOptionsBassTPL,
  stringCountOptionsGuitarDBL,
} from '../constants/string_count';
import { INSTRUMENT_TYPES } from '../constants/instrument_templates';
import { calculatorStore } from '../calculator.store';
import { Build, ClearAll } from '@material-ui/icons';
import { BRANDS } from '../constants/brands';
import { STRING_SETS } from '../constants/string_sets';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '90%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  templateItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: '8px 16px',
  },
  generateButton: {
    marginTop: '24px',
  },
}));

export const TemplateForm = () => {
  const classes = useStyles();
  const [instrumentType, setInstrumentType] = useState('guitar');
  const [stringCount, setStringCount] = useState(6);
  const [tuningType, setTuningType] = useState(
    tuningTypeOptions[0].value || 'STD',
  );
  const [tuning, setTuning] = useState('');
  const [stringSet, setStringSet] = useState('');
  const [hasError, setHasError] = useState(false);
  const stringOptions = calculateStringCountOptions(instrumentType);
  const tuningOptions = calculateTuningOptions(instrumentType, stringCount);

  const clear = () => {
    setInstrumentType('guitar');
    setStringCount(6);
    setTuningType(tuningTypeOptions[0].value);
    setTuning('');
    setStringSet('');
  };

  const handleSubmit = () => {
    setHasError(false);
    const option = tuningOptions.find((o) => o.id === tuning);
    if (option) {
      calculatorStore.generateTemplate({
        instrumentType,
        stringCount,
        tuningType,
        tuningOffset: option.offset,
        stringSet: stringSet.split(',').map((s) => parseFloat(s)),
      });
    } else {
      setHasError(true);
    }
    clear();
  };
  let bassBaseStringCount;
  switch (instrumentType) {
    case INSTRUMENT_TYPES.BASS_DBL: {
      bassBaseStringCount = stringCount / 2;
      break;
    }
    case INSTRUMENT_TYPES.BASS_TPL: {
      bassBaseStringCount = stringCount / 3;
      break;
    }
    default: {
      bassBaseStringCount = stringCount;
    }
  }

  const bassOffsetRaisedThreshold =
    20 - 5 * (bassBaseStringCount > 4 ? bassBaseStringCount - 5 : 0);
  const isTuningTypeDisabled =
    instrumentType !== INSTRUMENT_TYPES.GUITAR &&
    instrumentType !== INSTRUMENT_TYPES.BASS &&
    instrumentType !== INSTRUMENT_TYPES.GUITAR_DBL;
  const formHasEmptyValues =
    !stringCount || !tuningType || !instrumentType || !tuning;
  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h5" style={{ color: '#ffca28' }}>
          Template Form
        </Typography>
        {hasError && (
          <Alert severity="error">An error occurred generating template</Alert>
        )}
      </CardContent>
      <CardContent className={classes.cardContent}>
        <Grid container>
          <Grid className={classes.templateItem} item xs>
            <Typography variant="overline">Instrument Type</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={instrumentType}
                onChange={(event) => {
                  switch (event.target.value) {
                    case INSTRUMENT_TYPES.BASS_TPL: {
                      setStringCount(stringCountOptionsBassTPL[0]);
                      break;
                    }
                    case INSTRUMENT_TYPES.BASS_DBL: {
                      setStringCount(stringCountOptionsBassDBL[0]);
                      break;
                    }
                    case INSTRUMENT_TYPES.GUITAR_DBL: {
                      setStringCount(stringCountOptionsGuitarDBL[0]);
                      break;
                    }
                    case INSTRUMENT_TYPES.BASS: {
                      setStringCount(4);
                      break;
                    }
                    default: {
                      setStringCount(6);
                    }
                  }
                  setInstrumentType(event.target.value as string);
                }}
              >
                <MenuItem value={INSTRUMENT_TYPES.GUITAR}>Guitar</MenuItem>
                <MenuItem value={INSTRUMENT_TYPES.BASS}>Bass</MenuItem>
                <MenuItem value={INSTRUMENT_TYPES.GUITAR_DBL}>
                  Guitar (Double Course)
                </MenuItem>
                <MenuItem value={INSTRUMENT_TYPES.BASS_DBL}>
                  Bass (Double Course)
                </MenuItem>
                <MenuItem value={INSTRUMENT_TYPES.BASS_TPL}>
                  Bass (Triple Course)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.templateItem} item xs>
            <Typography variant="overline">String Count</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={stringCount}
                type="select"
                onChange={(e) => setStringCount(+e.target.value)}
              >
                {stringOptions.map((num) => (
                  <MenuItem
                    key={num}
                    value={num}
                    disabled={num < 6 && instrumentType === 'guitar'}
                  >
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.templateItem} item xs>
            <Typography variant="overline">Tuning Variation</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={tuningType}
                onChange={(e) => setTuningType(e.target.value as string)}
              >
                <MenuItem value="STD">Standard</MenuItem>
                <MenuItem value="DRP">Drop</MenuItem>
                <MenuItem
                  disabled={stringCount < 6 || isTuningTypeDisabled}
                  value="DAD"
                >
                  DADGAD
                </MenuItem>
                <MenuItem disabled={isTuningTypeDisabled} value="DDRP">
                  Double Drop Extended (DADADGBE ect)
                </MenuItem>
                <MenuItem disabled={isTuningTypeDisabled} value="DDRPMM">
                  Double Drop Mike Mushok (GDADGBE ect)
                </MenuItem>
                <MenuItem disabled={isTuningTypeDisabled} value="DRP4">
                  Drop + P4 (EAEADGBE ect)
                </MenuItem>
                <MenuItem
                  disabled={stringCount < 6 || isTuningTypeDisabled}
                  value="DRPDAD"
                >
                  Drop + DADGAD (GDADGAD ect)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.templateItem} item xs>
            <Typography variant="overline">Tuning</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={tuning}
                type="select"
                onChange={(e) => setTuning(e.target.value as string)}
              >
                <MenuItem hidden value="" />
                {tuningOptions.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                    {instrumentType.startsWith('g') &&
                      t.offset < 5 &&
                      ` (Raised)`}
                    {instrumentType.startsWith('b') &&
                      t.offset < bassOffsetRaisedThreshold &&
                      ` (Raised)`}
                    {instrumentType.startsWith('g') &&
                      t.offset > 16 &&
                      ` (Contrabass)`}
                    {instrumentType.startsWith('b') &&
                      t.offset > bassOffsetRaisedThreshold + 11 &&
                      ` (Contrabass)`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.templateItem} item xs>
            <Typography variant="overline">Set (optional)</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                native
                id="grouped-native-select-set"
                defaultValue={stringSet}
                type="select"
                onChange={(e) => setStringSet(e.target.value as string)}
              >
                <option value="" />
                {Object.keys(STRING_SETS).map((key) => (
                  <optgroup key={key} label={key}>
                    {Object.keys(STRING_SETS[key]).map((setKey) => {
                      const set = STRING_SETS[key][setKey];
                      if (set.length === stringCount) {
                        return (
                          <option key={`${key}${setKey}`} value={set}>
                            {`${setKey} (${set[0]}-${set[set.length - 1]})`}
                          </option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </optgroup>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.templateItem} item xs>
            <Button
              className={classes.generateButton}
              color="primary"
              variant="contained"
              disabled={formHasEmptyValues}
              endIcon={<Build />}
              onClick={handleSubmit}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
