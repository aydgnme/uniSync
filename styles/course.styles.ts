import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.select({
            ios: '#F2F2F7',
            android: '#F0F0F0',
        }),
        marginTop: -100,
    },
    content: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        padding: 16,
    },
    header: {
        padding: 20,
        paddingTop: 100,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerContent: {
        marginTop: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#202124',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1967D2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        marginTop: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#202124',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bannerContainer: {
        height: 160,
        position: 'relative',
    },
    banner: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    courseHeader: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    courseCode: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
        marginBottom: 4,
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    courseInstructor: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
    },
    listContainer: {
        padding: 16,
    },
    studentId: {
        fontSize: 18,
        color: '#666',
        fontWeight: '400',
    },
});
