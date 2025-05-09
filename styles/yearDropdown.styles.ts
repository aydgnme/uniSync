import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    yearButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedYearButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    yearButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    selectedYearButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});