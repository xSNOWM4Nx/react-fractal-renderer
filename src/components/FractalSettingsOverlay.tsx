import React, { useContext, useEffect } from 'react';
import { Box, Typography, FormGroup, FormControl, Button, Select, MenuItem, Slider, Divider, useTheme } from '@mui/material';
import { AppContext, SettingKeys } from '../components/infrastructure/AppContextProvider.js';
import { FractalKeys, FractalSettingKeys } from '../helpers/renderingHelpers.js';

// Types
import type { SelectChangeEvent, Theme, SxProps } from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';

interface ILocalProps {
}
type Props = ILocalProps;

export const FractalSettingsOverlay: React.FC<Props> = (props) => {

  // External hooks
  const theme = useTheme();

  // Contexts
  const appContext = useContext(AppContext);

  const [juliaSetR, setJuliaSetR] = React.useState<number>(-0.8);
  const [juliaSetI, setJuliaSetI] = React.useState<number>(0.156);

  const getSetting = (key: string, type: string) => {

    const value = appContext.pullSetting(key)
    if (typeof (value) === type)
      return value;

    if (type === 'boolean')
      return false;
    if (type === 'string')
      return '';
    if (type === 'number')
      return 0;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    setJuliaSetR(-0.8);
    setJuliaSetI(0.156);

    appContext.pushSetting(FractalSettingKeys.JuliaSetR, -0.8)
    appContext.pushSetting(FractalSettingKeys.JuliaSetI, 0.156)
    appContext.pushSetting(FractalSettingKeys.ResetSettings, true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    appContext.pushSetting(FractalSettingKeys.ResetSettings, false);
  };

  const handleFractalTypeChange = (e: SelectChangeEvent) => {
    appContext.pushSetting(FractalSettingKeys.FractalKey, e.target.value);
  };

  const handleJuliaRChange = (event: Event, newValue: number | number[]) => {
    setJuliaSetR(newValue as number);
    appContext.pushSetting(FractalSettingKeys.JuliaSetR, newValue as number)
  };

  const handleJuliaIChange = (event: Event, newValue: number | number[]) => {
    setJuliaSetI(newValue as number);
    appContext.pushSetting(FractalSettingKeys.JuliaSetI, newValue as number)
  };

  const renderHeader = () => {

    return (

      <React.Fragment>

        <Typography
          variant={'h6'}
          gutterBottom={true}>
          {'Fractal settings'}
        </Typography>

      </React.Fragment>
    )
  };

  const renderOperatingInstructions = () => {

    return (

      <React.Fragment>

        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}>

          <Typography
            variant={'body2'}>
            {'Zoom in:'}
          </Typography>
          <Typography
            sx={{
              marginLeft: 'auto'
            }}
            variant={'body2'}>
            {'Q + Left mouse'}
          </Typography>
        </Box>

        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}>

          <Typography
            variant={'body2'}>
            {'Zoom out:'}
          </Typography>
          <Typography
            sx={{
              marginLeft: 'auto'
            }}
            variant={'body2'}>
            {'A + Left mouse'}
          </Typography>
        </Box>

        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}>

          <Typography
            variant={'body2'}>
            {'Panning:'}
          </Typography>
          <Typography
            sx={{
              marginLeft: 'auto'
            }}
            variant={'body2'}>
            {'Middle mouse'}
          </Typography>
        </Box>

        <Button
          sx={{
            marginTop: (theme) => theme.spacing(1)
          }}
          variant="contained"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}>

          {'Reset'}
        </Button>

      </React.Fragment>
    )
  };

  const renderJuliaSettings = () => {

    return (
      <React.Fragment>

        <Box
          sx={{ height: (theme) => theme.spacing(2) }}
          component='div' />

        <Box
          component='div'>

          <Typography
            id="input-slider"
            gutterBottom>
            {'r-Part (c)'}
          </Typography>
          <Slider
            min={-2}
            max={2}
            defaultValue={-0.8}
            step={0.001}
            value={juliaSetR}
            onChange={handleJuliaRChange}
            aria-label="Default"
            valueLabelDisplay="auto" />
        </Box>

        <Box
          sx={{ height: (theme) => theme.spacing(2) }}
          component='div' />

        <Box
          component='div'>

          <Typography
            id="input-slider"
            gutterBottom>
            {'i-Part (c)'}
          </Typography>
          <Slider
            min={-2}
            max={2}
            defaultValue={0.156}
            step={0.001}
            value={juliaSetI}
            onChange={handleJuliaIChange}
            aria-label="Default"
            valueLabelDisplay="auto" />
        </Box>

      </React.Fragment>
    )
  };

  const renderFractalSettings = () => {

    var selectedFractalKey = getSetting(FractalSettingKeys.FractalKey, 'string');
    if (selectedFractalKey === '')
      selectedFractalKey = FractalKeys.MandelbrotSet;

    return (
      <Box
        sx={{

        }}>

        <FormGroup>
          <Typography
            id="fractal-change-label-filled"
            gutterBottom>
            {'Fractal type'}
          </Typography>

          <FormControl
            color='secondary'
            variant="filled"
            sx={{ minWidth: 120 }}>

            {/* <InputLabel
              id="fractal-change-label-filled">
              {'Fractal type'}
            </InputLabel> */}
            <Select
              labelId="fractal-change-label-filled"
              id="fractal-change-select-filled"
              value={selectedFractalKey}
              onChange={handleFractalTypeChange}>

              <MenuItem
                value={FractalKeys.MandelbrotSet}>
                {FractalKeys.MandelbrotSet}
              </MenuItem>
              <MenuItem
                value={FractalKeys.JuliaSet}>
                {FractalKeys.JuliaSet}
              </MenuItem>
            </Select>
          </FormControl>

        </FormGroup>

        {selectedFractalKey === FractalKeys.JuliaSet && renderJuliaSettings()}

      </Box>
    );
  };

  return (

    <Box
      component='div'
      sx={{
        overflow: 'hidden',
        position: 'relative',
        maxHeight: 'calc(100vh - 160px)',
        minWidth: 268,
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 5,
        opacity: 0.9,
        padding: theme.spacing(1)
      }}>

      {/* {renderHeader()} */}
      {renderOperatingInstructions()}
      <Divider
        flexItem={true}
        sx={{ margin: (theme) => theme.spacing(1) }} />
      {renderFractalSettings()}
    </Box>
  );
}
