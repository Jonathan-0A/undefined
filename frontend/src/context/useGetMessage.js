import { useEffect, useState } from 'react';
import useConversation from '../states/useConversation.js';
import axios from 'axios';

export default function useGetMessage() {
  const [loadMsg, setLoadMsg] = useState(false);
  const [messages, setMessages] = useState([]); // Added local state to manage messages
  const { selectedConversation } = useConversation();

  useEffect(() => {
    // Guard clause to return if no selected conversation
    if (!selectedConversation || !selectedConversation._id) return;

    const controller = new AbortController(); // Create a new AbortController instance

    const getMessages = async () => {
      setLoadMsg(true);
      try {
        // console.log('Selected Conversation ID:', selectedConversation._id);
        const res = await axios.get(`/message/get/${selectedConversation._id}`, {
          signal: controller.signal, // Pass abort signal to axios
        });

        if (res.status === 200) {
          // console.log(res.data.messages);
          setMessages(res.data.messages); // Set messages to local state
        } else {
          console.error("Unexpected response:", res);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request cancelled:', err.message);
        } else {
          console.error("Error fetching messages:", err);
        }
      } finally {
        setLoadMsg(false);
      }
    };

    getMessages();

    // Clean up function to cancel request if component unmounts
    return () => controller.abort();

  }, [selectedConversation]);

  return { messages, setMessages, loadMsg }; // Return messages instead of the `message` state
}
