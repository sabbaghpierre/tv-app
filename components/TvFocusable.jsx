import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';

export default function TvFocusable(props) {
  return (
    <TouchableOpacity
      hasTVPreferredFocus={props.hasTVPreferredFocus}
      style={props.style}
      tvParallaxProperties={{
        enabled: true,
        magnification: props.magnification ? props.magnification : 1.0,
        shiftDistanceX: props.shiftDistanceX ? props.shiftDistanceX : 2.0,
        shiftDistanceY: props.shiftDistanceY ? props.shiftDistanceY : 2.0,
        tiltAngle: props.tiltAngle ? props.tiltAngle : 0.05,
        pressMagnification: props.pressMagnification
          ? props.pressMagnification
          : 1.0,
        pressDuration: props.pressDuration ? props.pressDuration : 0.3,
        pressDelay: props.pressDelay ? props.pressDelay : 0.0,
      }}
      activeOpacity={Platform.isTVOS ? 1.0 : 0.5}
      onPress={props.onPress}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      isTVSelectable={true}>
      {props.child}
    </TouchableOpacity>
  );
}