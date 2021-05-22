import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { calculatorStore } from '../calculator.store';
import { useSnapshot } from 'valtio';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BRANDS } from '../constants/brands';
import {
  KeyboardArrowDownSharp,
  KeyboardArrowUpSharp,
} from '@material-ui/icons';

const woundThirdOptions = [
  {
    name: 'Wound at .017',
    value: 'w3@17',
  },
  {
    name: 'Wound starts .021',
    value: 'w3@21',
  },
  {
    name: 'Wound till .026',
    value: 'w3@26',
  },
];

const tensileOptions = [350000, 400000, 450000];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '90%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  modifierItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: '8px 16px',
  },
}));

export const ModifierForm = () => {
  const calculatorSnap = useSnapshot(calculatorStore);
  const classes = useStyles();

  const [minScaleSbj] = useState(() => new ReplaySubject<number>());
  const [minScale, setMinScale] = useState<string>('');
  const [maxScaleSbj] = useState(() => new ReplaySubject<number>());
  const [maxScale, setMaxScale] = useState<string>('');
  const [minTensionSbj] = useState(() => new ReplaySubject<number>());
  const [minTension, setMinTension] = useState<string>('');
  const [maxTensionSbj] = useState(() => new ReplaySubject<number>());
  const [maxTension, setMaxTension] = useState<string>('');

  useEffect(() => {
    setMinScale('' + calculatorSnap.modifiers.minScaleLength);
    setMaxScale('' + calculatorSnap.modifiers.maxScaleLength);
    setMinTension('' + calculatorSnap.modifiers.minTension);
    setMaxTension('' + calculatorSnap.modifiers.maxTension);
  }, [calculatorSnap.modifiers]);

  const handleMinScaleChange = (minScale: string) => {
    setMinScale(minScale);
    minScaleSbj.next(+minScale);
    minScaleSbj.pipe(debounceTime(400)).subscribe((val) => {
      calculatorStore.modifyInstrument({
        ...calculatorSnap.modifiers,
        minScaleLength: val,
      });
    });
  };
  const handleMaxScaleChange = (maxScale: string) => {
    setMaxScale(maxScale);
    maxScaleSbj.next(+maxScale);
    maxScaleSbj.pipe(debounceTime(400)).subscribe((val) => {
      calculatorStore.modifyInstrument({
        ...calculatorSnap.modifiers,
        maxScaleLength: val,
      });
    });
  };
  const handleMinTensionChange = (minTension: string) => {
    setMinTension(minTension);
    minTensionSbj.next(+minTension);
    minTensionSbj.pipe(debounceTime(400)).subscribe((val) => {
      calculatorStore.modifyInstrument({
        ...calculatorSnap.modifiers,
        minTension: val,
      });
    });
  };
  const handleMaxTensionChange = (maxTension: string) => {
    setMaxTension(maxTension);
    maxTensionSbj.next(+maxTension);
    maxTensionSbj.pipe(debounceTime(400)).subscribe((val) => {
      calculatorStore.modifyInstrument({
        ...calculatorSnap.modifiers,
        maxTension: val,
      });
    });
  };

  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h5" style={{ color: '#ffca28' }}>
          Modifiers Form
        </Typography>
      </CardContent>
      <CardContent className={classes.cardContent}>
        <Grid container>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Shifter</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => calculatorStore.shiftTune(false)}
                >
                  <KeyboardArrowDownSharp />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => calculatorStore.shiftTune(true)}
                >
                  <KeyboardArrowUpSharp />
                </Button>
              </Box>
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Min Scale Length</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <TextField
                variant="filled"
                type="text"
                onChange={(e) => handleMinScaleChange(e.target.value)}
                value={minScale}
              />
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Max Scale Length</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <TextField
                variant="filled"
                type="text"
                onChange={(e) => handleMaxScaleChange(e.target.value)}
                value={maxScale}
              />
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Min Tension</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <TextField
                variant="filled"
                type="text"
                onChange={(e) => handleMinTensionChange(e.target.value)}
                value={minTension}
              />
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Max Tension</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <TextField
                variant="filled"
                type="text"
                onChange={(e) => handleMaxTensionChange(e.target.value)}
                value={maxTension}
              />
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Brand</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                native
                id="grouped-native-select-brand"
                defaultValue={calculatorSnap.modifiers.brand}
                type="select"
                onChange={(e) => {
                  calculatorStore.modifyInstrument({
                    ...calculatorSnap.modifiers,
                    brand: e.target.value as string,
                  });
                }}
              >
                {Object.keys(BRANDS).map((key) => (
                  <optgroup key={key} label={key}>
                    {BRANDS[key].map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.name}&nbsp;{`(${brand.value})`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Wound 3rd Threshold</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                native
                id="grouped-native-select-w3"
                defaultValue={calculatorSnap.modifiers.woundThirdThreshold}
                type="select"
                onChange={(e) =>
                  calculatorStore.modifyInstrument({
                    ...calculatorSnap.modifiers,
                    woundThirdThreshold: e.target.value as string,
                  })
                }
              >
                {woundThirdOptions.map((o) => (
                  <option value={o.value} key={o.value}>
                    {o.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.modifierItem} item xs>
            <Typography variant="overline">Tensile</Typography>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                native
                id="grouped-native-select-ten"
                defaultValue={calculatorSnap.modifiers.tensile}
                type="select"
                onChange={(e) =>
                  calculatorStore.modifyInstrument({
                    ...calculatorSnap.modifiers,
                    tensile: e.target.value as number,
                  })
                }
              >
                {tensileOptions.map((t) => (
                  <option value={t} key={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
