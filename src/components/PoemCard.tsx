import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";

export default function PoemCard({
  title,
  author,
  image,
  rating,
  commentCount,
  onPress,
}: {
  title: string;
  author: string;
  image: any;
  rating?: number;
  commentCount?: number;
  onPress?: () => void;
}) {
  const imageSource =
    typeof image === "string" ? { uri: image } : image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
          {typeof rating === "number" || typeof commentCount === "number" ? (
            <Text style={styles.meta}>
              {typeof rating === "number" ? `★ ${rating.toFixed(1)}` : ""}
              {typeof rating === "number" && typeof commentCount === "number"
                ? " • "
                : ""}
              {typeof commentCount === "number" ? `${commentCount} comments` : ""}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 200,
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.3)", // ✨ soft purple border for style
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  textContainer: {
    padding: 12,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  author: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  meta: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 2,
  },
});
