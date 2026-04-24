import { Text, TextInput, View, type TextInputProps } from "react-native";

import { useAppTheme } from "../providers/ThemeProvider";

interface AppTextInputProps extends TextInputProps {
  label: string;
}

export function AppTextInput({ label, ...props }: AppTextInputProps) {
  const { theme } = useAppTheme();

  return (
    <View className="gap-2">
      <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="text-sm">
        {label}
      </Text>
      <TextInput
        placeholderTextColor={theme.colors.textSoft}
        style={[
          theme.fonts.body,
          {
            height: 56,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.cardStrong,
            paddingHorizontal: 16,
            color: theme.colors.text
          }
        ]}
        {...props}
      />
    </View>
  );
}
