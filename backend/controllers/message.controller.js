import Conversation from "../models/conversation.model.js"
import Message from "../models/messages.model.js"

export const sendMessage = async (req, res) => {
    console.log('sendMessage function triggered!');
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Validate the message input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }
        console.log("Requested message: ", message);
        // Check if a conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If the conversation does not exist, create it
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: [],
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Add the message ID to the conversation
        conversation.messages.push(newMessage._id);

        // Save both the new message and the conversation
        await Promise.all([newMessage.save(), conversation.save()]);

        // Return success response
        res.status(201).json({ message: "Message sent", newMessage });
    } catch (err) {
        console.error("Error sending message: ", err); // Improved error logging
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessage = async (req, res) => {
    // console.log('sendMessage function triggered!')
    try {
        const { id: chatUser } = req.params;
        const senderId = req.user._id;
        console.log(chatUser, senderId)

        // Find the conversation with the given participants
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatUser] }
        }).populate("messages");

        // Check if the conversation exists
        if (!conversation) {
            return res.status(200).json([]); // Return empty array if no conversation found
        }

        const messages = conversation.messages;

        // Return the messages with a 200 status
        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error to get message: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}