import { StringRowElement } from './StringRow';
import { initString } from '../utils/string.utils';
import { calculatorStore } from '../calculator.store';
import { FormControl, MenuItem, Select } from '@material-ui/core';

const octaves = [8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2];

export const OctaveCell: React.FC<StringRowElement> = ({
  instrumentString,
}) => {
  const handleChange = (oct) => {
    const newStateString = initString({ ...instrumentString, octave: +oct });
    calculatorStore.updateString(newStateString);
  };
  return (
    <FormControl variant="filled">
      <Select
        value={instrumentString.octave}
        type="select"
        onChange={(e) => handleChange(e.target.value)}
      >
        {octaves.map((oct) => (
          <MenuItem key={oct} value={oct}>
            {oct}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
