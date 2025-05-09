import { styles } from '@/styles/calendar.styles';
import { Event, MarkedDates } from '@/types/calendar.type';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import EventCard from './EventCard';

interface MonthViewProps {
    selectedDate: string;
    markedDates: MarkedDates;
    onDateChange: (date: string) => void;
    events: Event[];
}

const MonthView: React.FC<MonthViewProps> = ({ selectedDate, markedDates, onDateChange, events }) => {
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
                {events.filter(event => event.date === selectedDate).map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
                {events.filter(event => event.date === selectedDate).length === 0 && (
                    <Text style={styles.noEventsText}>No events on this date</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default MonthView;