import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, cards } from "./components";
import { useFonts } from "expo-font";
import { AppLoading } from "expo";
import Animated, {
  Value,
  Clock,
  Node,
  useCode,
  cond,
  eq,
  add,
  interpolate,
  Extrapolate,
  startClock,
  set,
  not,
  proc,
} from "react-native-reanimated";
import { useClock, useValues } from "react-native-redash";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const duration = 1000;

const runAnimation = proc(
  (
    startAnimation: Value<number>,
    clock: Clock,
    from: Value<number>,
    to: Value<number>,
    startTime: Value<number>,
    opacity: Node<number>
  ) =>
    cond(eq(startAnimation, 1), [
      startClock(clock),
      set(from, opacity),
      set(to, not(to)),
      set(startTime, clock),
      set(startAnimation, 0),
    ])
);

const ClockValuesAndIdentity = () => {
  const [fontsLoaded] = useFonts({
    "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
    "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
    "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
  });

  const [show, setShow] = useState(true);

  const clock = useClock();
  const [startTime, from, to, startAnimation] = useValues(0, 0, 0, 1);
  const endTime = add(startTime, duration);
  const opacity = interpolate(clock, {
    inputRange: [startTime, endTime],
    outputRange: [from, to],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(() => set(startAnimation, 1), [show]);
  useCode(
    () => runAnimation(startAnimation, clock, from, to, startTime, opacity),
    [startAnimation, clock, from, to, startTime, opacity]
  );

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={{ opacity }}>
          <Card card={cards[0]} />
        </Animated.View>
      </View>

      <Button
        label={show ? "Hide" : "Show"}
        primary
        onPress={() => setShow((prev) => !prev)}
      />
    </View>
  );
};

export default ClockValuesAndIdentity;
