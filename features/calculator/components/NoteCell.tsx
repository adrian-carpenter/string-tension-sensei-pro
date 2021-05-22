import { StringRowElement } from './StringRow';
import { NOTE_OFFSET } from '../constants/note_offset';
import { initString } from '../utils/string.utils';
import { calculatorStore } from '../calculator.store';
import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
}));

export const NoteCell: React.FC<StringRowElement> = ({ instrumentString }) => {
  const classes = useStyles();
  const handleChange = (note) => {
    const newStateString = initString({ ...instrumentString, note });
    calculatorStore.updateString(newStateString);
  };
  const notes = Object.keys(NOTE_OFFSET);
  return (
    <FormControl variant="filled" className={classes.formControl}>
      <Select
        value={instrumentString.note}
        type="select"
        onChange={(e) => handleChange(e.target.value)}
      >
        {notes.map((note) => (
          <MenuItem key={note} value={note}>
            {note}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
