import { styles } from '@/styles/noGradesMessage.styles';
import React from 'react';
import { Text, View } from 'react-native';

interface NoGradesMessageProps {
    message?: string;
}

const NoGradesMessage: React.FC<NoGradesMessageProps> = ({ message = 'No grades available for this year.' }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

export default NoGradesMessage;
