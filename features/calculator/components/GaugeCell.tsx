import React, { useEffect, useState } from 'react';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { formatGauge, initString } from '../utils/string.utils';
import { calculatorStore } from '../calculator.store';
import { FormControl, TextField } from '@material-ui/core';
import { StringRowElement } from './StringRow';

export const GaugeCell: React.FC<StringRowElement> = ({ instrumentString }) => {
  const [inputSbj] = useState(() => new ReplaySubject<number>());
  const [inputGauge, setInputGauge] = useState<string>('');
  useEffect(() => {
    setInputGauge(formatGauge(instrumentString.gauge));
  }, [instrumentString]);
  const handleChange = (gauge) => {
    setInputGauge(gauge);
    inputSbj.next(gauge);
    inputSbj.pipe(debounceTime(400)).subscribe((val) => {
      const newStateString = initString({
        ...instrumentString,
        gauge: +val,
      });
      calculatorStore.updateString(newStateString);
    });
  };

  return (
    <FormControl>
      <TextField
        variant="filled"
        type="text"
        onChange={(e) => handleChange(e.target.value)}
        value={inputGauge}
      />
    </FormControl>
  );
};
