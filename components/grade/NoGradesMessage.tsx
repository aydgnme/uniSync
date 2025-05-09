import { styles } from '@/styles/noGradesMessage.styles';
import React from 'react';
import { Text, View } from 'react-native';

const NoGradesMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>No grades available for this year.</Text>
        </View>
    );
};

export default NoGradesMessage;
