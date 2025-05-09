import { styles } from '@/styles/calendar.styles';
import { Event } from '@/types/calendar.type';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface EventCardProps {
    event: Event;
    onPress?: (event: Event) => void;
}

const EVENT_COLOR = '#D32F2F';

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
    const handlePress = () => {
        if (onPress) onPress(event);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.eventCard, { borderLeftColor: EVENT_COLOR }]}>  
            <View style={styles.eventTimeLocation}>
                <View style={styles.eventTimeContainer}>
                    <Icon name="time-outline" size={16} color={EVENT_COLOR} />
                    <Text style={[styles.eventInfo, { color: EVENT_COLOR }]}>{event.time}</Text>
                </View>
                <View style={styles.eventLocationContainer}>
                    <Icon name="location-outline" size={16} color={EVENT_COLOR} />
                    <Text style={[styles.eventInfo, { color: EVENT_COLOR }]}>{event.location}</Text>
                </View>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
            {event.organizer && <Text style={styles.eventOrganizer}>{event.organizer}</Text>}
        </TouchableOpacity>
    );
};

export default EventCard;