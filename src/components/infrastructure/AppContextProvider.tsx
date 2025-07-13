import React, { useRef, useState, useEffect } from 'react';
import { ThemeKeys } from '../../styles/index.js';

export class SettingKeys {
  public static EnablePathPrediction = 'EnablePathPrediction';
  public static ShowDataOverlayOnMap = 'ShowDataOverlayOnMap';
};

const getDefaultSettings = () => {
  return {
    [SettingKeys.EnablePathPrediction]: true,
    [SettingKeys.ShowDataOverlayOnMap]: true
  };
};

// Definition for app context props
export interface AppContextProps {
  hasConnectionErrors: boolean;
  activeThemeName: string;
  changeTheme: (themeName: string) => void;
  pushSetting: (key: string, value: any) => boolean;
  pullSetting: (key: string) => any;
};

// Create the app context
export const AppContext = React.createContext<AppContextProps>({
  hasConnectionErrors: false,
  activeThemeName: ThemeKeys.DarkTheme,
  changeTheme: (themeName: string) => { },
  pushSetting: (key: string, value: any) => false,
  pullSetting: (key: string) => undefined
});

interface ILocalProps {
  children?: React.ReactNode;
  onThemeChange?: (themeName: string) => void;
};
type Props = ILocalProps;

const AppContextProvider: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = 'AppContextProvider'

  // States
  const [hasConnectionErrors, setConnectionErrors,] = useState(false);
  const [activeThemeName, setActiveThemeName] = useState(ThemeKeys.DarkTheme);
  const [settingsStorage, setSettingsStorage] = useState<{ [key: string]: any }>(getDefaultSettings());

  // Effects
  useEffect(() => {

    // Mount

    // Unmount
    return () => {

    }
  }, []);

  const handleThemeChange = (themeName: string) => {

    if (props.onThemeChange)
      props.onThemeChange(themeName);

    setActiveThemeName(themeName);
  };

  const handlePushSetting = (key: string, value: any) => {

    // OFI -> Store data in indexedDB or localStorage

    const settingsStorageCopy = { ...settingsStorage };
    settingsStorageCopy[key] = value;
    setSettingsStorage(settingsStorageCopy);

    return true;
  };

  const handlePullSetting = (key: string,) => {
    return settingsStorage[key];
  };

  return (

    <AppContext.Provider
      value={
        {
          hasConnectionErrors: hasConnectionErrors,
          activeThemeName: activeThemeName,
          changeTheme: handleThemeChange,
          pushSetting: handlePushSetting,
          pullSetting: handlePullSetting
        }} >
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
