import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';

export const items = [
    {
        text: "Home",
        icon: <HomeIcon />,
        to: "/",
        exact: true,
    },
    {
        text: "ChatSpace",
        icon: <ChatIcon />,
        to: "/chat-space",
        exact: true,
    },
    {
        text: "Log Out",
        icon: <LogoutIcon />,
        to: "/auth/logout",
        exact: true,
    },
]