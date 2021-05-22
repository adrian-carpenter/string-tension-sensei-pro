import { TemplateForm } from './components/TemplateForm';
import { Box, Button, Card, CardContent } from '@material-ui/core';
import { InstrumentContainer } from './components/InstrumentContainer';
import { ModifierForm } from './components/ModifierForm';
import { ClearAll } from '@material-ui/icons';
import React from 'react';
import { calculatorStore } from './calculator.store';

const CalculatorController: React.FC = () => {
  return (
    <Box>
      <Box>
        <TemplateForm />
      </Box>
      <Box>
        <ModifierForm />
      </Box>
      <Box>
        <InstrumentContainer />
      </Box>
    </Box>
  );
};

export default CalculatorController;
