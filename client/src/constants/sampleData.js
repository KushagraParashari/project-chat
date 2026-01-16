
export const sampleChats = [{
  _id: "64d123456789abcdef123456", name: "Chat 1",
  avatar: ["https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"],
  groupChat: false,
  members: ["1", "2"]
}, {
  _id: "64d987654321abcdef654321",
  name: "Chat 2",
  avatar: ["https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg",
    "https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg",
    "https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"],
  groupChat: true,
  members: ["1", "2"]

}]

export const sampleUsers = [
  {
    _id: "1",
    name: "User 1",
    avatar: "https://example.com/avatar1.png",
  },
  {
    _id: "2",
    name: "User 2",
    avatar: "https://example.com/avatar2.png",
  },
  {
    _id: "3",
    name: "User 3",
    avatar: "https://example.com/avatar3.png",
  },
]

export const sampleMessages = [
  {
    _id: "1",
    sender: {
      name: "User 1",
      avatar: "https://example.com/avatar1.png",
    },
    content: "Hello!",
    timestamp: "2023-10-01T12:00:00Z",
  },
  {
    _id: "2",
    sender: {
      name: "User 2",
      avatar: "https://example.com/avatar2.png",
    },
    content: "Hi there!",
    timestamp: "2023-10-01T12:01:00Z",
  },
  {
    _id: "3",
    sender: {
      name: "User 3",
      avatar: "https://example.com/avatar3.png",
    },
    content: "How are you?",
    timestamp: "2023-10-01T12:02:00Z",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "asdasd",
        url: "https://www.w3schools.com/howto/img_avatar.png"
      },
    ],
    content: "vtdvdh",
    _id: "ggfbtbsgrtn",
    sender: {
      _id: "1",
      name: "User 1",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",

  }
]

export const sampleChatsData = [
  {
    _id: '1',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    name: 'Study Group',
    totalMembers: 5,
    members: [
      'https://randomuser.me/api/portraits/men/12.jpg',
      'https://randomuser.me/api/portraits/women/13.jpg',
      'https://randomuser.me/api/portraits/men/14.jpg',
    ],
    totalMessages: 150,
    creator: {
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    friends: 10,
    groups: 3,
  },
  {
    _id: '2',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    name: 'Tech Enthusiasts',
    totalMembers: 8,
    members: [
      'https://randomuser.me/api/portraits/men/21.jpg',
      'https://randomuser.me/api/portraits/men/22.jpg',
      'https://randomuser.me/api/portraits/men/23.jpg',
      'https://randomuser.me/api/portraits/men/24.jpg',
    ],
    totalMessages: 320,
    creator: {
      name: 'Bob Smith',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    friends: 18,
    groups: 7,
  },]

