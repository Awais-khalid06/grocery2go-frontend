import React, {forwardRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

const BottomSheet = forwardRef((props, ref) => {
  const {height = 100, children, ...otherProps} = props;

  return (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={height}
      customStyles={{
        draggableIcon: {
          height: 0,
        },
        container: {
          width: '100%',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: '#ffffff',
          elevation: 5, // Elevation for the box shadow
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
      }}
      {...otherProps}>
      {children}
    </RBSheet>
  );
});

export default BottomSheet;
