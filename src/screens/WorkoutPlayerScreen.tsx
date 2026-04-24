import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPlaybackItemById } from "../data/playbackCatalog";
import { triggerHaptic } from "../lib/haptics";
import { useAppTheme } from "../providers/ThemeProvider";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutPlayer">;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function WorkoutPlayerScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const playbackItem = useMemo(
    () => getPlaybackItemById(route.params.workoutId),
    [route.params.workoutId]
  );
  const player = useVideoPlayer(null, (currentPlayer) => {
    currentPlayer.loop = true;
    currentPlayer.timeUpdateEventInterval = 0.25;
  });
  const shouldAutoplay = route.params.autoplay ?? true;
  const videoSources =
    playbackItem.videoSources && playbackItem.videoSources.length > 0
      ? playbackItem.videoSources
      : [playbackItem.videoUrl];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [mutedForAutoplay, setMutedForAutoplay] = useState(Platform.OS === "web");
  const playingState = useEvent(player, "playingChange", {
    isPlaying: player.playing
  });
  const mutedState = useEvent(player, "mutedChange", {
    muted: player.muted
  });
  const statusState = useEvent(player, "statusChange", {
    status: player.status,
    error: undefined
  });
  const timeState = useEvent(player, "timeUpdate", {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0
  });
  const sourceState = useEvent(player, "sourceLoad", {
    videoSource: null,
    duration: 0,
    availableAudioTracks: [],
    availableVideoTracks: [],
    availableSubtitleTracks: []
  });

  const isPlaying = playingState.isPlaying;
  const isMuted = mutedState.muted;
  const clipDuration = Math.max(
    1,
    Math.round(sourceState?.duration && sourceState.duration > 0 ? sourceState.duration : playbackItem.duration * 60)
  );
  const elapsed = Math.min(Math.floor(timeState.currentTime), clipDuration);
  const progress = clipDuration > 0 ? elapsed / clipDuration : 0;
  const isLoading = statusState.status === "loading" || statusState.status === "idle";
  const currentSource = videoSources[sourceIndex];

  useEffect(() => {
    setSourceIndex(0);
    setErrorMessage(null);
    setFirstFrameReady(false);
    setAutoplayAttempted(false);
    setMutedForAutoplay(Platform.OS === "web");
  }, [playbackItem.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadSource() {
      setErrorMessage(null);
      setFirstFrameReady(false);
      setAutoplayAttempted(false);

      player.pause();
      player.currentTime = 0;
      player.loop = true;
      player.timeUpdateEventInterval = 0.25;
      player.muted = Platform.OS === "web" && mutedForAutoplay;

      try {
        await player.replaceAsync({
          uri: currentSource,
          useCaching: true
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "This video could not be loaded.";
        if (sourceIndex < videoSources.length - 1) {
          setSourceIndex((value) => value + 1);
          return;
        }

        setErrorMessage(message);
      }
    }

    loadSource();

    return () => {
      cancelled = true;
    };
  }, [currentSource, mutedForAutoplay, player, sourceIndex, videoSources.length]);

  useEffect(() => {
    if (statusState.status === "error") {
      if (sourceIndex < videoSources.length - 1) {
        setSourceIndex((value) => value + 1);
        return;
      }

      setErrorMessage(statusState.error?.message ?? "This video could not be loaded.");
      return;
    }

    if (statusState.status !== "readyToPlay" || autoplayAttempted || !shouldAutoplay) {
      return;
    }

    player.play();
    setAutoplayAttempted(true);
  }, [
    autoplayAttempted,
    player,
    shouldAutoplay,
    sourceIndex,
    statusState.error?.message,
    statusState.status,
    videoSources.length
  ]);

  async function handlePlayPause() {
    await triggerHaptic("soft");

    if (errorMessage) {
      setErrorMessage(null);
      setSourceIndex(0);
      return;
    }

    if (isPlaying) {
      player.pause();
      return;
    }

    if (Platform.OS === "web" && isMuted) {
      player.muted = false;
      setMutedForAutoplay(false);
    }

    player.play();
  }

  async function handleToggleSound() {
    await triggerHaptic("soft");
    const nextMuted = !player.muted;
    player.muted = nextMuted;
    setMutedForAutoplay(nextMuted);
  }

  async function handleRetry() {
    await triggerHaptic("soft");
    setErrorMessage(null);
    setSourceIndex(0);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <VideoView
        allowsPictureInPicture
        contentFit="cover"
        nativeControls={false}
        onFirstFrameRender={() => setFirstFrameReady(true)}
        player={player}
        playsInline
        style={{ flex: 1 }}
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.18)", "rgba(0,0,0,0.86)"]}
        style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
      >
        <SafeAreaView className="flex-1 justify-between px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={async () => {
                await triggerHaptic();
                navigation.goBack();
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.12)"
              }}
            >
              <Ionicons color="#FFFFFF" name="chevron-back" size={24} />
            </Pressable>
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleToggleSound}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.12)"
                }}
              >
                <Ionicons color="#FFFFFF" name={isMuted ? "volume-mute" : "volume-high"} size={20} />
              </Pressable>
              <View
                style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                className="rounded-full px-4 py-2"
              >
                <Text style={theme.fonts.caption} className="text-[10px] text-white">
                  IMMERSIVE PLAYER
                </Text>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center", justifyContent: "center", minHeight: 180 }}>
            {(isLoading || errorMessage || !firstFrameReady || !isPlaying) && (
              <View
                style={{ backgroundColor: "rgba(0,0,0,0.46)", borderColor: "rgba(255,255,255,0.16)" }}
                className="w-full max-w-[320px] rounded-[28px] border px-6 py-6"
              >
                <View className="items-center gap-4">
                  {isLoading && !errorMessage ? (
                    <ActivityIndicator color="#FFFFFF" size="large" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 82,
                        height: 82,
                        borderRadius: 41,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.colors.primary
                      }}
                    >
                      <Ionicons
                        color="#04100B"
                        name={errorMessage ? "refresh" : "play"}
                        size={32}
                      />
                    </Pressable>
                  )}

                  <View className="items-center">
                    <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="text-lg text-center">
                      {errorMessage
                        ? "Playback hit a snag"
                        : isLoading
                          ? "Preparing your video"
                          : isPlaying
                            ? "Now playing"
                            : "Tap play to start"}
                    </Text>
                    <Text style={theme.fonts.body} className="mt-2 text-center text-sm text-white/74">
                      {errorMessage
                        ? errorMessage
                        : firstFrameReady
                          ? playbackItem.subtitle
                          : "Loading a workout clip for this card."}
                    </Text>
                    {errorMessage && (
                      <Pressable
                        className="mt-4 rounded-full px-4 py-2"
                        onPress={handleRetry}
                        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      >
                        <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="text-sm">
                          Retry video
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>

          <View>
            <Text style={[theme.fonts.displayLarge, { color: "#FFFFFF" }]} className="text-5xl">
              {playbackItem.title}
            </Text>
            <Text style={theme.fonts.body} className="mt-3 text-sm leading-6 text-white/74">
              {playbackItem.instructor.name} guiding a {playbackItem.category} clip designed to make
              this screen feel alive.
            </Text>

            <View className="mt-8 flex-row gap-3">
              {[
                { label: "Category", value: playbackItem.category.toUpperCase() },
                { label: "Energy", value: playbackItem.intensity.toUpperCase() },
                { label: "Timer", value: formatTime(elapsed) }
              ].map((metric) => (
                <View
                  key={metric.label}
                  style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  className="flex-1 rounded-2xl px-4 py-3"
                >
                  <Text style={theme.fonts.caption} className="text-[10px] text-white/65">
                    {metric.label}
                  </Text>
                  <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="mt-2 text-base">
                    {metric.value}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-8">
              <View className="mb-3 flex-row items-center justify-between">
                <Text style={theme.fonts.body} className="text-sm text-white/72">
                  {formatTime(elapsed)}
                </Text>
                <Text style={theme.fonts.body} className="text-sm text-white/72">
                  {formatTime(clipDuration)}
                </Text>
              </View>
              <View className="h-2 rounded-full bg-white/20">
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.max(progress * 100, 4)}%`,
                    backgroundColor: theme.colors.primary
                  }}
                />
              </View>
            </View>

            <View className="mt-8 flex-row items-center justify-between">
              <Pressable
                onPress={handlePlayPause}
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.primary
                }}
              >
                <Ionicons
                  color="#04100B"
                  name={isPlaying ? "pause" : errorMessage ? "refresh" : "play"}
                  size={28}
                />
              </Pressable>

              <View className="flex-1 pl-5">
                <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="text-lg">
                  {playbackItem.subtitle}
                </Text>
                <Text style={theme.fonts.body} className="mt-2 text-sm text-white/74">
                  {playbackItem.description}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
