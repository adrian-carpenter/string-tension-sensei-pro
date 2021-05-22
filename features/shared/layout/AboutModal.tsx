import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { Copyright, Info } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '90%',
      maxHeight: '75%',
      overflow: 'auto'
    },
    boxSection: {
      marginBottom: '16px',
    },
    sectionTitle: {
      color: theme.palette.primary.main,
      fontSize: '18px',
      fontWeight: 'bolder',
    },
    assetColor: {
      color: '#ffca28',
    },
  }),
);

export const AboutModal = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button endIcon={<Info />} onClick={handleOpen}>
        About
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">
              About String Tension Sensei <Copyright />
              2021
            </h2>
            <Box className={classes.boxSection}>
              <Typography className={classes.sectionTitle}>Goal</Typography>
              <span>
                This app is intended to educated players on their current string
                set tension and assist them in creating custom string sets with
                specific requirements (Balanced Tension, Progressive Tension,
                ect)
              </span>
            </Box>
            <Box className={classes.boxSection}>
              <Typography className={classes.sectionTitle}>
                How to Use
              </Typography>
              <span>
                Generate an{' '}
                <strong className={classes.assetColor}>Instrument</strong> from
                the <em className={classes.assetColor}>Template Form</em> with
                or without an existing{' '}
                <em className={classes.assetColor}>String Set</em> and start use
                the <em className={classes.assetColor}>Modifiers Form</em> to
                play around with the different parameters. Be aware, that the
                note selected in the TUNING section will be the resulting lowest
                string note in the created instrument. This can be slightly
                confusing at first. For example if you wanted a 7 string with
                the 6 strings in Drop Bb and the lowest being an F a perfect 4th
                (P4) lower. You would select Drop + P4 and the tuning would be
                F, not raised. As you learn the tuning types and their
                relationships it becomes easier to get your desired tuning on
                the first try.
              </span>
            </Box>
            <Box className={classes.boxSection}>
              <Typography className={classes.sectionTitle}>
                Common Questions
              </Typography>
              <Box
                className={classes.boxSection}
                style={{ marginLeft: '12px' }}
              >
                <Typography
                  className={classes.sectionTitle}
                  style={{ fontSize: '16px' }}
                >
                  How accurate is app?
                </Typography>
                <p>
                  Depends...under the hood is uses the publicly available
                  D'Addario string tension chart (it's however, outdated) and
                  the Kalium string mass (which used to be available on their
                  website). Each one of these UNIT MASSES was entered by hand.
                  Note that string sets other than DA in the Template Form use
                  DA to calculate the tension as they manufacturer's weight
                  aren't available to the public. The app does a good job of
                  approximating tension, bearing in mind that the less extreme
                  the gauges (in terms of thickness) the greater the accuracy.
                  Once gauges get above 0.080 and the brand isn't Kalium, it
                  switches to using D'Addario Nickel Bass Strings (DAXB) to
                  start approximating heavier gauges. These DAXB only go up to
                  0.145 so beyond that it's trying to estimate the given tension
                  by approximating the theoretical UNIT WEIGHT by incrementing
                  the UW by a set unit between the most recent gauges' unit
                  weight. NOTE: that unit weight isn't linear as the string
                  gauge increase, therefore the more extreme the thickness the
                  less accurate the tension will be. In general, Kalium strings
                  are the most accurate due to the gauges spanning from
                  0.008-0.266, but due to their construction tend to have a
                  higher tension overall than DA, however, DA tends to be the
                  best representative of most major manufacturer's tension. It's
                  best to flip back and forth between KA and DA especially when
                  dealing with gauges greater than 0.145 to get a general
                  estimation of the tension.Lastly, due to the amount of
                  variation in interval placement. It's possible that the
                  template form can produce some "odd" tunings that don't quite
                  function as expected given the TUNING_TYPE. These are minor
                  bugs that shouldn't occur, but it's important to note that the
                  app isn't 100% accurate end-to-end
                </p>
              </Box>
              <Box
                className={classes.boxSection}
                style={{ marginLeft: '12px' }}
              >
                <Typography
                  className={classes.sectionTitle}
                  style={{ fontSize: '16px' }}
                >
                  Why are certain tunings disabled?
                </Typography>
                <span>
                  Due to increase complexity and variations in tuning, certain
                  tunings are disabled once the instrument becomes a
                  Double-Course or Triple-Course Instrument as well as for
                  basses with 4 & 5 strings respectively. In addition, non-Drop
                  & non-STD variations in Basses above 5 strings use guitar type
                  Major 3rd (M3) intervals when calculating the template. The
                  regular boilerplate tuning types should account for nearly all
                  use cases for users. More complex tunings need to created
                  manually. For example, if you want Opeth's Ghost Reveries
                  Dadd9 tuning (DADFAE) it's best to template the instrument to
                  6 string DADGAD tuning type (in D) resulting in DADGAD and
                  changing the 1st and 3rd string respectively to meet DADFAE.{' '}
                </span>
              </Box>
              <Box
                className={classes.boxSection}
                style={{ marginLeft: '12px' }}
              >
                <Typography
                  className={classes.sectionTitle}
                  style={{ fontSize: '16px' }}
                >
                  Where are open tunings?
                </Typography>
                <span>
                  While open tunings, consisting of roots, 5ths, and 3rds, are
                  easy in theory. The amount of variation and placement of these
                  intervals create so many combinations that it's easier to
                  manually create the desired tuning rather than creating a
                  bunch of conditional logic. Furthermore, since there's no way
                  to determine intention of placement, i.e. CGCGCG or CGCGCE or
                  CGCEGC or CEGCGE, the resulting template would lack the desired behavior. tl;dr - Just create it manually
                </span>
              </Box>
              <Box
                className={classes.boxSection}
                style={{ marginLeft: '12px' }}
              >
                <Typography
                  className={classes.sectionTitle}
                  style={{ fontSize: '16px' }}
                >
                  The app shows string gauges that don't exist.
                </Typography>
                <span>
                  One of the primary goals of the app to calculate the correct
                  gauges of a given tension or set of low-to-high tensions. It's
                  more concerned with getting as close as possible to these
                  ideals rather than checking to see if a gauge exists. If the
                  gauge doesn't exist than you'll need to increase the gauge
                  either up and down (of those that exist) to determine the best
                  string to buy when creating your custom string set.
                </span>
              </Box>
              <Box
                className={classes.boxSection}
                style={{ marginLeft: '12px' }}
              >
                <Typography
                  className={classes.sectionTitle}
                  style={{ fontSize: '16px' }}
                >
                  The app crashed!
                </Typography>
                <span>
                  Although coded to be reliable, it may be possible to crash the
                  app by changing the template parameters quickly. The tuning is
                  created dynamically given the set of constraints of the
                  instrument and string count. It's best to create templates
                  from left-to-right to allow the app, in the background, to
                  generate the correct form options of a given template.
                </span>
              </Box>
            </Box>
          </div>
        </Fade>
      </Modal>
    </>
  );
};
