import React, { useContext } from 'react';
import { Box, Typography, Card, CardContent, FormGroup, FormControl, FormControlLabel, InputLabel, Switch, Select, SelectChangeEvent, MenuItem } from '@mui/material';
import { SystemContext, ViewContainer } from '@daniel.neuweiler/react-lib-module';
import { AppContext } from './../contexts';
import { ViewKeys } from './../navigation';
import { ThemeKeys } from './../styles';

interface ILocalProps {
}
type Props = ILocalProps;

const SettingsView: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.SettingsView;

  // Contexts
  const systemContext = useContext(SystemContext);
  const appContext = useContext(AppContext);

  const handleChange = (e: SelectChangeEvent) => {
    appContext.changeTheme(e.target.value);
  };

  const renderAppSettings = () => {

    return (
      <Card>

        <CardContent>

          <Typography
            variant={'h6'}
            gutterBottom={true}>
            {'App settings'}
          </Typography>

          <FormGroup>
            <FormControl
              color='secondary'
              variant="filled"
              sx={{ m: 1, minWidth: 120 }}>

              <InputLabel
                id="theme-change-label-filled">
                Theme change
              </InputLabel>
              <Select
                labelId="theme-change-label-filled"
                id="theme-change-select-filled"
                value={appContext.activeThemeName}
                onChange={handleChange}>

                <MenuItem
                  value={ThemeKeys.DarkTheme}>
                  {ThemeKeys.DarkTheme}
                </MenuItem>
                <MenuItem
                  value={ThemeKeys.LightTheme}>
                  {ThemeKeys.LightTheme}
                </MenuItem>
              </Select>
            </FormControl>

          </FormGroup>
        </CardContent>
      </Card>
    );
  };

  return (

    <ViewContainer
      isScrollLocked={true}>

      {renderAppSettings()}

      <Box
        component='div'
        sx={{ height: (theme) => theme.spacing(1) }} />

    </ViewContainer>
  );
}

export default SettingsView;
