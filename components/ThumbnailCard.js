import React from 'react';
import { ImageBackground, View } from 'react-native';
import TvFocusable from '../components/TvFocusable';
export default function ThumbnailCard(props) {
  return (
    <TvFocusable
      style={props.style}
      allowMagnification={true}
      magnification={1.05}
      onFocus={props.onFocus}
      child={
        <View
          style={{
            direction: 'rtl',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ImageBackground
            source={{
              uri: props.imageUrl,
            }}
            style={{
              aspectRatio: 16 / 9,
              width: 280,
              borderRadius: 12,
              overflow: 'hidden',
            }}
            resizeMode="cover">
           
          </ImageBackground>
        </View>
      }
    />
  );
}