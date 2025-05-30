import { Message, messageService } from '@/services/message.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useMessages = () => {
  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: messageService.getMessages,
  });

  const markAsReadMutation = useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: messageService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  return {
    messages,
    isLoading,
    isError,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
  };
}; 