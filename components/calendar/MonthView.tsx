import { styles } from '@/styles/calendar.styles';
import { Class, Event, MarkedDates } from '@/types/calendar.type';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import EventCard from './EventCard';

interface MonthViewProps {
    selectedDate: string;
    markedDates: MarkedDates;
    onDateChange: (date: string) => void;
    events: Event[];
    classes: Class[];
}

const MonthView: React.FC<MonthViewProps> = ({ 
    selectedDate, 
    markedDates, 
    onDateChange, 
    events,
    classes = [] 
}) => {
    // Filter classes for the selected day
    const getClassesForDate = (date: string) => {
        const dayOfWeek = new Date(date).getDay();
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return classes.filter(cls => cls.day.toLowerCase() === daysOfWeek[dayOfWeek]);
    };

    return (
        <View style={styles.monthContainer}>
            <Calendar
                firstDay={1}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, dotColor: '#007AFF' }
                }}
                onDayPress={(day: DateData) => onDateChange(day.dateString)}
                style={styles.calendar}
                theme={{
                    todayTextColor: '#007AFF',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#ffffff',
                    monthTextColor: '#007AFF',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600',
                }}
            />

            <ScrollView style={styles.eventList}>
                {/* Classes */}
                {getClassesForDate(selectedDate).map(cls => (
                    <View key={cls.id} style={styles.classCard}>
                        <Text style={styles.classTitle}>{cls.title}</Text>
                        <Text style={styles.classTime}>
                            {cls.startTime} - {cls.endTime}
                        </Text>
                        <Text style={styles.classRoom}>Room: {cls.room}</Text>
                    </View>
                ))}

                {/* Events */}
                {events.filter(event => event.date === selectedDate).map(event => (
                    <EventCard key={event.id} event={event} />
                ))}

                {/* No classes or events */}
                {getClassesForDate(selectedDate).length === 0 && 
                 events.filter(event => event.date === selectedDate).length === 0 && (
                    <Text style={styles.noEventsText}>No classes or events on this date</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default MonthView;