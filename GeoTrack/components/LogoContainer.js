import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoContainer = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.imageWrapper}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/LogoSavaSAC.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  imageWrapper: {
    width: 124,
    height: 124,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5CE1E6',
    borderStyle: 'dashed',
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default LogoContainer;