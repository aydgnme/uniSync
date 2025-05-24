import { styles } from '@/styles/calendar.styles';
import { Course as CalendarCourse } from '@/types/calendar.type';
import { Course } from '@/types/course.type';
import moment from 'moment';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import WeekCourseCard from './WeekCourseCard';

interface WeekViewProps {
    selectedDate: string;
    events: CalendarCourse[];
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const convertToCourse = (event: CalendarCourse): Course => {
    const [startTime, endTime] = event.time.split(' - ');
    return {
        code: event.group,
        title: event.title,
        type: event.type === 'lecture' ? 'LECTURE' : event.type === 'course' ? 'LAB' : 'SEMINAR',
        startTime,
        endTime,
        duration: event.duration,
        room: event.location,
        teacher: event.teacher,
        weekDay: moment(event.date).isoWeekday(),
    };
};

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, events }) => {
    const weekStart = moment(selectedDate).startOf("isoWeek");
    const days = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days"));

    return (
        <ScrollView style={styles.weekView}>
            {days.map((day, index) => {
                const currentDate = day.format("YYYY-MM-DD");
                const dayEvents = events.filter(event => event.date === currentDate);

                return (
                    <View key={currentDate} style={styles.weekDaySection}>
                        <View style={styles.weekDayHeader}>
                            <Text style={styles.weekDayName}>{WEEKDAYS[index]}</Text>
                            <Text style={styles.weekDayDate}>{day.format("DD MMMM")}</Text>
                        </View>
                        {dayEvents.map(event => (
                            <WeekCourseCard key={event.id} course={convertToCourse(event)} />
                        ))}
                        {dayEvents.length === 0 && (
                            <Text style={styles.noEventsText}>No events</Text>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default WeekView;
