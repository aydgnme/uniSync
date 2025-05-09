import { styles } from '@/styles/yearDropdown.styles';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface YearDropdownProps {
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    availableYears: string[];
}

const YearDropdown: React.FC<YearDropdownProps> = ({ selectedYear, setSelectedYear, availableYears }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Academic Year</Text>
            <FlatList
                data={availableYears}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
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
                keyExtractor={item => item}
            />
        </View>
    );
};

export default YearDropdown;