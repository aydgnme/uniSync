import { useCourses } from '@/hooks/useCourses';
import { useLectureAnnouncements } from '@/hooks/useLectureAnnouncements';
import { useLectureAssignments } from '@/hooks/useLectureAssignments';
import { useLecturePeople } from '@/hooks/useLecturePeople';
import { useProfile } from '@/hooks/useProfile';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const getBannerByType = (type: 'LECTURE' | 'LAB' | 'SEMINAR') => {
    // Map course type to banner image
    switch (type) {
        case 'LAB':
            return require('@/assets/images/img_code.jpg');
        case 'LECTURE':
            return require('@/assets/images/img_bookclub.jpg');
        case 'SEMINAR':
            return require('@/assets/images/img_reachout.jpg');
        default:
            return require('@/assets/images/img_bookclub.jpg');
    }
};

const CourseDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream');
  const [announcement, setAnnouncement] = useState('');

  const { user } = useProfile();
  const studentId = user?.id;

  const { courses } = useCourses(typeof studentId === 'string' ? studentId : '');
  const course = courses.find((c) => c.id === id);

  const { announcements } = useLectureAnnouncements(id as string);
  const { assignments } = useLectureAssignments(id as string);
  const { people } = useLecturePeople(id as string);

  if (!course) return null;

  const renderAnnouncementCard = (item: {
    id: string;
    text: string;
    date: string;
    author: string;
    comments: number;
    attachments: number;
  }) => (
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
    </View>
  );

  const renderAssignmentCard = (item: {
    id: string;
    title: string;
    dueDate: string;
    points: number;
    topic: string;
  }) => (
    <TouchableOpacity key={item.id} style={styles.assignmentCard}>
      <View style={styles.assignmentIcon}>
        <MaterialIcons name="assignment" size={24} color={course.color || '#1a73e8'} />
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
            </View>
            {announcements.map(renderAnnouncementCard)}
          </View>
        );
      case 'classwork':
        return (
          <View style={styles.classworkContainer}>
            {assignments.map(renderAssignmentCard)}
          </View>
        );
      case 'people':
        return (
          <View style={styles.peopleContainer}>
            <View style={styles.peopleSection}>
              <Text style={styles.sectionTitle}>Teachers</Text>
              <View style={styles.personCard}>
                <View style={styles.personAvatar}>
                  <Text style={styles.avatarText}>{course.teacher.full_name[0]}</Text>
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{course.teacher.full_name}</Text>
                  <Text style={styles.personRole}>Course Owner</Text>
                </View>
              </View>
            </View>
            <View style={styles.peopleSection}>
              <Text style={styles.sectionTitle}>Students ({people.length})</Text>
              {people.map((student) => (
                <View key={student.id} style={styles.personCard}>
                  <View style={styles.personAvatar}>
                    <Text style={styles.avatarText}>{student.name[0]}</Text>
                  </View>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{student.name}</Text>
                    <Text style={styles.personRole}>{student.role}</Text>
                  </View>
                </View>
              ))}
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
          source={getBannerByType(course.type)}
          style={[styles.banner, { backgroundColor: course.color || '#1a73e8' }]}
          imageStyle={{ opacity: 0.2 }}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.subtitle}>{course.code}</Text>
            <Text style={styles.instructor}>{course.teacher.full_name}</Text>
          </View>
        </ImageBackground>

        <View style={styles.tabs}>
          {['stream', 'classwork', 'people'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as 'stream' | 'classwork' | 'people')}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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