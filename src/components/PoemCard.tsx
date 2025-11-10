import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";

// 🗺️ Local image map
const localImages: Record<string, any> = {
  "Blood_Silk.jpeg": require("../assets/images/poems/Blood_Silk.jpeg"),
  // 💡 add any other local image names here
};

export default function PoemCard({
  title,
  author,
  image,
}: {
  title: string;
  author: string;
  image: any;
}) {
  
  const imageSource =
    typeof image === "string"
      ? localImages[image] || { uri: image } 
      : image;

  return (
    <TouchableOpacity style={styles.card}>
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
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
});
