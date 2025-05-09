import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    header: {
        marginBottom: 24,
    },
    courseName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 16,
        color: '#666',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    examsContainer: {
        backgroundColor: '#fff',
    },
    examRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    examType: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    examDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    examScore: {
        fontSize: 16,
        color: '#333',
        marginRight: 12,
    },
    examWeight: {
        fontSize: 14,
        color: '#666',
        minWidth: 50,
    },
});
