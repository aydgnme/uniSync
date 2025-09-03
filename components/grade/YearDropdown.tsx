import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface YearDropdownProps {
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    availableYears: string[];
}

const YearDropdown: React.FC<YearDropdownProps> = ({
    selectedYear,
    setSelectedYear,
    availableYears
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Academic Year</Text>
            <FlatList
                data={availableYears}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={`year-${item}`}
                        style={[
                            styles.yearButton,
                            selectedYear === item && styles.selectedYearButton
                        ]}
                        onPress={() => setSelectedYear(item)}
                    >
                        <Text
                            style={[
                                styles.yearButtonText,
                                selectedYear === item && styles.selectedYearButtonText
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => `year-${item}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        marginHorizontal: 16,
    },
    yearButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        marginLeft: 16,
    },
    selectedYearButton: {
        backgroundColor: '#1976D2',
    },
    yearButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    selectedYearButtonText: {
        color: '#fff',
    },
});

export default YearDropdown;