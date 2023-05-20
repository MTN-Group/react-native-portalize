import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { portalContext } from './PortalContext';

export interface IManagerHandles {
  mount(key: string, children: React.ReactNode): void;
  update(key?: string, children?: React.ReactNode): void;
  unmount(key?: string): void;
}

export const Manager = React.forwardRef((_, ref): any => {
  const [portals, setPortals] = React.useState<{ key: string; children: React.ReactNode }[]>([]);
  const route = useRoute();

  React.useImperativeHandle(
    ref,
    (): IManagerHandles => ({
      mount(key: string, children: React.ReactNode): void {
          setPortals(prev => [...prev, { key, children }]);
      },

      update(key: string, children: React.ReactNode): void {
        setPortals(prev =>
          prev.map(item => {
            if (item.key === key) {
              return { ...item, children };
            }
            return item;
          }),
        );
      },

      unmount(key: string): void {
         if (route.name === "LoginDetails" || route.name === "PlanDetails" || route.name === "Subscriptions")
         {
            console.log("Route detected");
            setPortals(prev => prev.filter(item => item.key !== key));
         }
      },
    }),
  );
    
  return portals.map(({ key, children }, index: number) => (
    <View
      key={`react-native-portalize-${key}-${index}`}
      collapsable={false}
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
    >
      {children}
    </View>
  ));
});
