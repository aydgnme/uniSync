import { Message } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Today",
    sender: "system",
    timestamp: new Date(),
    type: "system",
  },
  {
    id: "2",
    text: "👋 Hello! I am your USV Secretary AI assistant. How can I help you?",
    sender: "ai",
    timestamp: new Date(),
  },
  {
    id: "3",
    text: "I can help you with the following topics:",
    sender: "ai",
    timestamp: new Date(),
    type: "options",
    options: [
      {
        title: "Registration Fee",
        icon: "📌",
        action: "registration",
      },
      {
        title: "Tuition Fees",
        icon: "🎓",
        action: "tuition",
      },
      {
        title: "Other Fees",
        icon: "💼",
        action: "other",
      },
    ],
  },
];

const SecretaryScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOptionSelect = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      let aiResponse: Message;

      switch (action) {
        case "registration":
          aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "📌 Registration Fee Information:\n\n• Fee Amount: 500 RON\n• Due Date: September 30, 2024\n\nWould you like to make a payment?",
            sender: "ai",
            timestamp: new Date(),
            type: "options",
            options: [
              {
                title: "Make Payment",
                icon: "💳",
                action: "pay_registration",
              },
              {
                title: "More Information",
                icon: "ℹ️",
                action: "info_registration",
              },
            ],
          };
          break;
        case "tuition":
          aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "🎓 Tuition Fee Options:\n\n• Annual Payment: 3000 RON\n• Semester Payment: 1500 RON\n\nWhich payment plan would you prefer?",
            sender: "ai",
            timestamp: new Date(),
            type: "options",
            options: [
              {
                title: "Annual Payment",
                icon: "📅",
                action: "pay_annual",
              },
              {
                title: "Semester Payment",
                icon: "📅",
                action: "pay_semester",
              },
            ],
          };
          break;
        case "other":
          aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "💼 Other Fees:\n\n• Exam Fees\n• Document Fees\n• Additional Services\n\nWhat information would you like to know?",
            sender: "ai",
            timestamp: new Date(),
            type: "options",
            options: [
              {
                title: "Exam Fees",
                icon: "📝",
                action: "exam_fee",
              },
              {
                title: "Document Fees",
                icon: "📄",
                action: "doc_fee",
              },
              {
                title: "Additional Services",
                icon: "🔍",
                action: "other_services",
              },
            ],
          };
          break;
        case "pay_registration":
        case "pay_annual":
        case "pay_semester":
        case "exam_fee":
        case "doc_fee":
          const paymentUrl =
            "https://www.taxeusv.ro/product-category/taxe-scolarizare/";
          Linking.openURL(paymentUrl);
          aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "💳 Redirecting you to the payment page...",
            sender: "ai",
            timestamp: new Date(),
          };
          break;
        default:
          aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "Can I help you with anything else?",
            sender: "ai",
            timestamp: new Date(),
            type: "options",
            options: initialMessages[2].options,
          };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simple AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "How can I help you?",
        sender: "ai",
        timestamp: new Date(),
        type: "options",
        options: initialMessages[2].options,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === "system") {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === "ai"
            ? styles.aiMessageContainer
            : styles.userMessageContainer,
        ]}
      >
        {item.sender === "ai" && (
          <View style={styles.aiAvatarContainer}>
            <Image
              source={require("@/assets/images/default-avatar.png")}
              style={styles.aiAvatar}
            />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            item.sender === "ai"
              ? styles.aiMessageBubble
              : styles.userMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.sender === "ai"
                ? styles.aiMessageText
                : styles.userMessageText,
            ]}
          >
            {item.text}
          </Text>

          {item.type === "options" && item.options && (
            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect(option.action)}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionText}>{option.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Online Support</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={30} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type here..."
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons
                name="arrow-up-circle"
                size={30}
                color={message.trim() ? "#007AFF" : "#C7C7CC"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  menuButton: {
    padding: 5,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  aiAvatarContainer: {
    marginRight: 8,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 20,
  },
  aiMessageBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  aiMessageText: {
    color: "#000000",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  optionsContainer: {
    marginTop: 12,
    width: "100%",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  addButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    marginRight: 8,
    color: "#000000",
  },
  sendButton: {
    padding: 2,
  },
});

export default SecretaryScreen;
