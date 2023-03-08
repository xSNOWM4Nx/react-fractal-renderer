import { NavigationElementProps } from '@daniel.neuweiler/react-lib-module';

import ErrorIcon from '@mui/icons-material/Error';
import FlightIcon from '@mui/icons-material/Flight';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';

export class SettingKeys {
  public static FractalKey = 'FractalKey';
};

export class ViewKeys {

  public static ErrorView: string = 'ErrorView';
  public static FractalView: string = 'FractalView';
  public static SettingsView: string = 'SettingsView';
  public static LogView: string = 'LogView';
  public static AboutView: string = 'AboutView';
}

export const ViewNavigationElements: { [key: string]: NavigationElementProps } = {
  [ViewKeys.ErrorView]: {
    display: {
      key: "views.errorview.display",
      value: "Uuups"
    },
    key: ViewKeys.ErrorView,
    importPath: "views/ErrorView",
    icon: ErrorIcon
  },
  [ViewKeys.FractalView]: {
    display: {
      key: "views.fractalview.display",
      value: "Fractal render display"
    },
    key: ViewKeys.FractalView,
    importPath: "views/FractalView",
    icon: FlightIcon
  },
  [ViewKeys.SettingsView]: {
    display: {
      key: "views.settingsview.display",
      value: "Settings"
    },
    key: ViewKeys.SettingsView,
    importPath: "views/SettingsView",
    icon: SettingsIcon
  },
  [ViewKeys.LogView]: {
    display: {
      key: "views.logview.display",
      value: "Logs"
    },
    key: ViewKeys.LogView,
    importPath: "views/LogView",
    icon: CodeIcon
  },
  [ViewKeys.AboutView]: {
    display: {
      key: "views.logview.display",
      value: "About"
    },
    key: ViewKeys.AboutView,
    importPath: "views/AboutView",
    icon: InfoIcon
  }
}
