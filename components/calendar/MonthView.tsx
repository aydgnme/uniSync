import { useAcademicCalendar } from '@/contexts/AcademicCalendarContext';
import { styles } from '@/styles/calendar.styles';
import { Class, Event, MarkedDates } from '@/types/calendar.type';
import moment from 'moment';
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

interface ClassWithWeekIndicator extends Class {
    weekIndicator: string;
    uniqueKey: string;
}

const MonthView: React.FC<MonthViewProps> = ({ 
    selectedDate, 
    markedDates, 
    onDateChange, 
    events,
    classes = [] 
}) => {
    const { calendarData } = useAcademicCalendar();

    // Get classes for the selected date
    const getClassesForDate = (date: string): ClassWithWeekIndicator[] => {
        const selectedMoment = moment(date);
        const dayOfWeek = selectedMoment.isoWeekday(); // 1 (Mon) - 7 (Sun)

        // Filter by day only, without week restriction
        const filteredClasses = classes
            .filter(cls => parseInt(cls.day) === dayOfWeek)
            .map(cls => {
                const classWeeks = cls.weeks || [];
                return {
                    ...cls,
                    weekIndicator: `Academic Weeks ${classWeeks.join(', ')}`,
                    uniqueKey: `${cls.id}-weeks-${classWeeks.join('-')}`
                };
            });

        return filteredClasses;
    };

    const classesForSelectedDate = getClassesForDate(selectedDate);
    const eventsForSelectedDate = events.filter(event => event.date === selectedDate);

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
                {classesForSelectedDate.map(cls => (
                    <EventCard 
                        key={cls.uniqueKey} 
                        event={{
                            id: cls.id,
                            title: cls.title,
                            time: `${cls.startTime} - ${cls.endTime}`,
                            location: cls.room,
                            date: selectedDate,
                            type: 'LECTURE',
                            style: {
                                backgroundColor: '#FFE0B2',
                                borderLeftWidth: 3,
                                borderLeftColor: '#FB8C00'
                            }
                        }} 
                    />
                ))}

                {eventsForSelectedDate.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}

                {classesForSelectedDate.length === 0 &&
                 eventsForSelectedDate.length === 0 && (
                    <Text style={styles.noEventsText}>No classes or events on this date</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default MonthView;