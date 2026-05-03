declare module "@expo-google-fonts/cormorant-garamond";
declare module "@expo-google-fonts/manrope";
declare module "@react-navigation/bottom-tabs";
declare module "@supabase/supabase-js" {
	export type User = any;
	export type Session = any;
	export function createClient(...args: any[]): any;
}

declare module "@react-native-async-storage/async-storage" {
	const AsyncStorage: any;
	export default AsyncStorage;
}

declare module "@shopify/flash-list" {
	export const FlashList: any;
}

declare module "@react-navigation/bottom-tabs" {
	export type BottomTabBarProps = any;
	export type BottomTabScreenProps<ParamList, RouteName> = any;
	export function createBottomTabNavigator<ParamList = any>(): any;
}
