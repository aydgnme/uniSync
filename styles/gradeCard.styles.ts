import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
    },
    courseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 14,
        color: '#888',
    },
    gradeContainer: {
        alignItems: 'flex-end',
    },
    grade: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    credits: {
        fontSize: 14,
        color: '#666',
    }
});
