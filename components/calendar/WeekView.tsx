import { styles } from '@/styles/calendar.styles';
import { Course } from '@/types/calendar.type';
import moment from 'moment';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import WeekCourseCard from './WeekCourseCard';

interface WeekViewProps {
    selectedDate: string;
    events: Course[];
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, events }) => {
    const weekStart = moment(selectedDate).startOf("isoWeek");
    const days = Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days"));

    if (!events) {
        return (
            <View style={[styles.weekView, { justifyContent: 'center', alignItems: 'center' }]}> 
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
                            <WeekCourseCard key={event.id || event.title + event.time} course={event} />
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