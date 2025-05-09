import courses from '@/data/courses.json';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Tab = 'stream' | 'classwork' | 'people';

interface Announcement {
    id: string;
    text: string;
    date: string;
    author: string;
    comments: number;
    attachments: number;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    points: number;
    topic: string;
}

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
    {
        id: '1',
        text: 'Welcome to the course! Here you will find all course materials and announcements.',
        date: '2024-03-20',
        author: 'Dr. Smith',
        comments: 3,
        attachments: 2,
    },
    {
        id: '2',
        text: 'Please review the course syllabus and upcoming assignment deadlines.',
        date: '2024-03-19',
        author: 'Dr. Smith',
        comments: 1,
        attachments: 1,
    },
];

const SAMPLE_ASSIGNMENTS: Assignment[] = [
    {
        id: '1',
        title: 'Midterm Project',
        dueDate: '2024-04-15',
        points: 100,
        topic: 'Projects',
    },
    {
        id: '2',
        title: 'Week 1 Quiz',
        dueDate: '2024-03-25',
        points: 20,
        topic: 'Quizzes',
    },
];

const CourseDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>('stream');
    const [announcement, setAnnouncement] = useState('');
    
    const course = courses.find(c => c.id === id);
    
    if (!course) return null;

    const renderAnnouncementCard = (item: Announcement) => (
        <View key={item.id} style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
                <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{item.author[0]}</Text>
                </View>
                <View style={styles.announcementHeaderText}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <Text style={styles.announcementDate}>{item.date}</Text>
                </View>
            </View>
            <Text style={styles.announcementText}>{item.text}</Text>
            <View style={styles.announcementFooter}>
                <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.footerButtonText}>{item.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="attach" size={20} color="#666" />
                    <Text style={styles.footerButtonText}>{item.attachments}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAssignmentCard = (item: Assignment) => (
        <TouchableOpacity key={item.id} style={styles.assignmentCard}>
            <View style={styles.assignmentIcon}>
                <MaterialIcons name="assignment" size={24} color={course.color} />
            </View>
            <View style={styles.assignmentContent}>
                <Text style={styles.assignmentTitle}>{item.title}</Text>
                <Text style={styles.assignmentDue}>Due {item.dueDate}</Text>
            </View>
            <Text style={styles.assignmentPoints}>{item.points} pts</Text>
        </TouchableOpacity>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stream':
                return (
                    <View style={styles.streamContainer}>
                        <View style={styles.announcementInput}>
                            <TextInput
                                style={styles.input}
                                placeholder="Announce something to your class"
                                value={announcement}
                                onChangeText={setAnnouncement}
                                multiline
                            />
                            <View style={styles.inputActions}>
                                <TouchableOpacity style={styles.attachButton}>
                                    <Ionicons name="attach" size={24} color="#666" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.postButton, !announcement && styles.postButtonDisabled]}
                                    disabled={!announcement}
                                >
                                    <Text style={[styles.postButtonText, !announcement && styles.postButtonTextDisabled]}>
                                        Post
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {SAMPLE_ANNOUNCEMENTS.map(renderAnnouncementCard)}
                    </View>
                );
            case 'classwork':
                return (
                    <View style={styles.classworkContainer}>
                        <TouchableOpacity style={styles.createButton}>
                            <Ionicons name="add" size={24} color="#fff" />
                            <Text style={styles.createButtonText}>Create</Text>
                        </TouchableOpacity>
                        <View style={styles.topicSection}>
                            <Text style={styles.topicTitle}>Projects</Text>
                            {SAMPLE_ASSIGNMENTS
                                .filter(a => a.topic === 'Projects')
                                .map(renderAssignmentCard)}
                        </View>
                        <View style={styles.topicSection}>
                            <Text style={styles.topicTitle}>Quizzes</Text>
                            {SAMPLE_ASSIGNMENTS
                                .filter(a => a.topic === 'Quizzes')
                                .map(renderAssignmentCard)}
                        </View>
                    </View>
                );
            case 'people':
                return (
                    <View style={styles.peopleContainer}>
                        <TouchableOpacity style={styles.inviteButton}>
                            <Ionicons name="person-add" size={20} color={course.color} />
                            <Text style={[styles.inviteButtonText, { color: course.color }]}>
                                Invite Students
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.peopleSection}>
                            <Text style={styles.sectionTitle}>Teachers</Text>
                            <View style={styles.personCard}>
                                <View style={styles.personAvatar}>
                                    <Text style={styles.avatarText}>
                                        {course.instructor.split(' ')[1][0]}
                                    </Text>
                                </View>
                                <View style={styles.personInfo}>
                                    <Text style={styles.personName}>{course.instructor}</Text>
                                    <Text style={styles.personRole}>Course Owner</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.peopleSection}>
                            <Text style={styles.sectionTitle}>Students (25)</Text>
                            <View style={styles.personCard}>
                                <View style={styles.personAvatar}>
                                    <Text style={styles.avatarText}>JS</Text>
                                </View>
                                <View style={styles.personInfo}>
                                    <Text style={styles.personName}>John Smith</Text>
                                    <Text style={styles.personRole}>Student</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <ImageBackground
                    source={{ uri: course.banner }}
                    style={[styles.banner, { backgroundColor: course.color }]}
                    imageStyle={{ opacity: 0.2 }}
                >
                    <View style={styles.bannerContent}>
                        <Text style={styles.title}>{course.title}</Text>
                        <Text style={styles.subtitle}>{course.code}</Text>
                        <Text style={styles.instructor}>{course.instructor}</Text>
                    </View>
                </ImageBackground>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'stream' && styles.activeTab]}
                        onPress={() => setActiveTab('stream')}
                    >
                        <Text style={[styles.tabText, activeTab === 'stream' && styles.activeTabText]}>
                            Stream
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'classwork' && styles.activeTab]}
                        onPress={() => setActiveTab('classwork')}
                    >
                        <Text style={[styles.tabText, activeTab === 'classwork' && styles.activeTabText]}>
                            Classwork
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'people' && styles.activeTab]}
                        onPress={() => setActiveTab('people')}
                    >
                        <Text style={[styles.tabText, activeTab === 'people' && styles.activeTabText]}>
                            People
                        </Text>
                    </TouchableOpacity>
                </View>

                {renderTabContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    banner: {
        height: 200,
        justifyContent: 'flex-end',
    },
    bannerContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 4,
    },
    instructor: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1a73e8',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#1a73e8',
    },
    streamContainer: {
        padding: 16,
    },
    announcementInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        fontSize: 14,
        minHeight: 40,
        textAlignVertical: 'top',
    },
    inputActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    attachButton: {
        padding: 8,
    },
    postButton: {
        backgroundColor: '#1a73e8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    postButtonDisabled: {
        backgroundColor: '#ccc',
    },
    postButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    postButtonTextDisabled: {
        color: '#666',
    },
    announcementCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a73e8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    announcementHeaderText: {
        marginLeft: 12,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    announcementDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    announcementText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    announcementFooter: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    footerButtonText: {
        marginLeft: 4,
        color: '#666',
        fontSize: 12,
    },
    classworkContainer: {
        padding: 16,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a73e8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    createButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '500',
    },
    topicSection: {
        marginBottom: 24,
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    assignmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    assignmentIcon: {
        marginRight: 16,
    },
    assignmentContent: {
        flex: 1,
    },
    assignmentTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    assignmentDue: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    assignmentPoints: {
        fontSize: 14,
        color: '#666',
    },
    peopleContainer: {
        padding: 16,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
    },
    inviteButtonText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    peopleSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    personCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    personAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a73e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    personInfo: {
        flex: 1,
    },
    personName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    personRole: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});

export default CourseDetailScreen; 