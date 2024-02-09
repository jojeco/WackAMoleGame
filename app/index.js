import {React, useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, ImageBackground, Pressable} from 'react-native';

import styles from '../styles/page-styles';

import { Link } from "expo-router";

export default function Page() {





return (
<View style={styles.container}>
    <Link
      style={styles.button}
      href={{
        pathname: "/EasyLevel",
       
      }} asChild
      >
      <Pressable>
        <Text>Make my Hall Pass!</Text>
      </Pressable>
    </Link>
</View>
)
}