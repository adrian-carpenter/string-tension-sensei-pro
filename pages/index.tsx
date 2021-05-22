import Head from 'next/head';
import Image from 'next/image';
import CalculatorController from '../features/calculator/CalculatorController';
import { Box } from '@material-ui/core';
import Header from '../features/shared/layout/Header';

export default function Home() {
  return (
    <Box>
      <Box>
        <Header />
      </Box>
      <Box>
        <CalculatorController />
      </Box>
    </Box>
  );
}
