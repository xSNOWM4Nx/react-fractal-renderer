
export const NavigationTypeEnumeration = {
  View: 0,
  Dialog: 1
} as const;
export type NavigationTypeEnumeration = typeof NavigationTypeEnumeration[keyof typeof NavigationTypeEnumeration];

export interface INavigationElement {
  key: string;
  name: string;
  importPath: string;
  type: NavigationTypeEnumeration;
  Icon?: React.FunctionComponent<any> | React.ComponentType<any> | string;
};

export interface INavigationElementProps {

};
