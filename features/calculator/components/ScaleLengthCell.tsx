import React, { useEffect, useState } from 'react';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { initString } from '../utils/string.utils';
import { calculatorStore } from '../calculator.store';
import { FormControl, TextField } from '@material-ui/core';
import { StringRowElement } from './StringRow';

export const ScaleLengthCell: React.FC<StringRowElement> = ({
  instrumentString,
}) => {
  const [inputSbj] = useState(() => new ReplaySubject<number>());
  const [inputScaleLength, setInputScaleLength] = useState<string>('');

  useEffect(() => {
    setInputScaleLength('' + instrumentString.scaleLength);
  }, [instrumentString]);

  const handleChange = (scaleLength) => {
    setInputScaleLength(scaleLength);
    inputSbj.next(scaleLength);
    inputSbj.pipe(debounceTime(400)).subscribe((val) => {
      const newStateString = initString({
        ...instrumentString,
        scaleLength: +val,
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
        value={inputScaleLength}
      />
    </FormControl>
  );
};
