const img = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

const ago = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const minsAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

const MAYA = 'u_maya';
const LEO = 'u_leo';
const SOFIA = 'u_sofia';
const JONAH = 'u_jonah';
const PRIYA = 'u_priya';
const ELIAS = 'u_elias';
const NINA = 'u_nina';
const THEO = 'u_theo';

function linkFollows(users) {
  users.forEach((user) => {
    user.followers = [];
  });
  users.forEach((user) => {
    user.following.forEach((id) => {
      const target = users.find((entry) => entry.id === id);
      if (target) target.followers.push(user.id);
    });
  });
}

function assertSeed(users, social) {
  const ids = new Set(users.map((user) => user.id));
  const fail = (message) => {
    throw new Error(`Seed: ${message}`);
  };

  users.forEach((user) => {
    user.following.forEach((id) => {
      if (!ids.has(id)) fail(`${user.id} follows missing ${id}`);
      const target = users.find((entry) => entry.id === id);
      if (!target.followers.includes(user.id)) fail(`${user.id} -> ${id} is not reciprocal`);
    });
    user.followers.forEach((id) => {
      if (!ids.has(id)) fail(`${user.id} has missing follower ${id}`);
    });
  });

  social.posts.forEach((post) => {
    if (!ids.has(post.userId)) fail(`post ${post.id} has a missing author`);
    post.likes.forEach((id) => {
      if (!ids.has(id)) fail(`post ${post.id} like ${id}`);
    });
    post.comments.forEach((comment) => {
      if (!ids.has(comment.userId)) fail(`comment ${comment.id}`);
    });
    post.savedBy.forEach((id) => {
      if (!ids.has(id)) fail(`post ${post.id} save ${id}`);
    });
  });

  social.notifications.forEach((note) => {
    if (!ids.has(note.userId) || !ids.has(note.fromUserId)) fail(`notification ${note.id}`);
    if (note.postId && !social.posts.some((post) => post.id === note.postId)) {
      fail(`notification ${note.id} post`);
    }
  });

  social.conversations.forEach((conversation) => {
    conversation.participantIds.forEach((id) => {
      if (!ids.has(id)) fail(`conversation ${conversation.id}`);
    });
    conversation.messages.forEach((message) => {
      if (!ids.has(message.senderId)) fail(`message ${message.id}`);
    });
  });

  social.stories.forEach((story) => {
    if (!ids.has(story.userId)) fail(`story ${story.id}`);
  });
}

export function createSeed() {
  const users = [
    {
      id: MAYA,
      name: 'Mounika Vaka',
      username: 'mounika',
      email: 'mounika@vesper.app',
      password: 'password123',
      avatar: img('photo-1534528741775-53994a69daeb', 400),
      cover: img('photo-1498050108023-c5249f4df085', 1600),
      bio: 'Product designer shaping calm interfaces. Sharing the work, the walks, and the details worth keeping.',
      location: 'Hyderabad',
      website: 'mounikavaka.com',
      following: [LEO, SOFIA, PRIYA, NINA],
      online: true,
      createdAt: '2024-03-12T15:00:00.000Z',
    },
    {
      id: LEO,
      name: 'Leo Park',
      username: 'leo',
      email: 'leo@vesper.app',
      password: 'password123',
      avatar: img('photo-1500648767791-00dcc994a43e', 400),
      cover: img('photo-1507525428034-b723cf961d3e', 1600),
      bio: 'Film photographer. Chasing last light and the long way home.',
      location: 'Los Angeles',
      website: 'leopark.photo',
      following: [MAYA, SOFIA, JONAH],
      online: true,
      createdAt: '2023-11-02T15:00:00.000Z',
    },
    {
      id: SOFIA,
      name: 'Sofia Rahman',
      username: 'sofia',
      email: 'sofia@vesper.app',
      password: 'password123',
      avatar: img('photo-1524504388940-b1c1722653e1', 400),
      cover: img('photo-1533105079780-92b9be482077', 1600),
      bio: 'Cities, trains, and the meals in between.',
      location: 'Lisbon',
      website: '',
      following: [MAYA, LEO, PRIYA, THEO],
      online: true,
      createdAt: '2024-01-18T15:00:00.000Z',
    },
    {
      id: JONAH,
      name: 'Jonah Blake',
      username: 'jonah',
      email: 'jonah@vesper.app',
      password: 'password123',
      avatar: img('photo-1506794778202-cad84cf45f1d', 400),
      cover: img('photo-1511671782779-c97d3d27a1d4', 1600),
      bio: 'Guitar, night buses, and rooms that are a little too loud.',
      location: 'Brooklyn',
      website: '',
      following: [MAYA, LEO, ELIAS],
      online: false,
      createdAt: '2023-08-09T15:00:00.000Z',
    },
    {
      id: PRIYA,
      name: 'Priya Nair',
      username: 'priya',
      email: 'priya@vesper.app',
      password: 'password123',
      avatar: img('photo-1544005313-94ddf0286df2', 400),
      cover: img('photo-1414235077428-338989a2e8c0', 1600),
      bio: 'Cook and weeknight maximalist. Lemon goes in late.',
      location: 'Chicago',
      website: 'priyanair.kitchen',
      following: [MAYA, SOFIA, NINA],
      online: true,
      createdAt: '2024-05-21T15:00:00.000Z',
    },
    {
      id: ELIAS,
      name: 'Elias Ward',
      username: 'elias',
      email: 'elias@vesper.app',
      password: 'password123',
      avatar: img('photo-1507003211169-0a1dd7228f2d', 400),
      cover: img('photo-1487958449943-2429e8be8625', 1600),
      bio: 'Architect. Concrete, shadow, and long tables.',
      location: 'Copenhagen',
      website: '',
      following: [NINA, THEO, MAYA],
      online: false,
      createdAt: '2022-12-01T15:00:00.000Z',
    },
    {
      id: NINA,
      name: 'Nina Okonkwo',
      username: 'nina',
      email: 'nina@vesper.app',
      password: 'password123',
      avatar: img('photo-1531123897727-8f129e1688ce', 400),
      cover: img('photo-1519681393784-d120267933ba', 1600),
      bio: 'Essays on attention, art, and ordinary days.',
      location: 'London',
      website: 'ninaokonkwo.com',
      following: [MAYA, PRIYA, ELIAS, SOFIA],
      online: true,
      createdAt: '2023-06-14T15:00:00.000Z',
    },
    {
      id: THEO,
      name: 'Theo Martins',
      username: 'theo',
      email: 'theo@vesper.app',
      password: 'password123',
      avatar: img('photo-1492562080023-ab3db95bfbce', 400),
      cover: img('photo-1476480862126-209bfaa8edc8', 1600),
      bio: 'Running slowly toward better mornings.',
      location: 'Austin',
      website: '',
      following: [JONAH, ELIAS, SOFIA],
      online: false,
      createdAt: '2024-07-02T15:00:00.000Z',
    },
  ];

  linkFollows(users);

  const posts = [
    {
      id: 'p_maya_studio',
      userId: MAYA,
      text: 'Rearranged the studio so the morning light hits the pinboard first. Quiet rooms make better decisions. #studio #design',
      media: { type: 'image', url: img('photo-1498050108023-c5249f4df085') },
      tags: ['studio', 'design'],
      likes: [LEO, SOFIA, NINA, THEO],
      shares: 4,
      savedBy: [LEO, NINA],
      createdAt: ago(3),
      comments: [
        {
          id: 'c_sofia_studio',
          userId: SOFIA,
          text: 'The calm in this frame is doing a lot of work.',
          createdAt: ago(2.4),
        },
        {
          id: 'c_leo_studio',
          userId: LEO,
          text: 'This palette should lead the spring series.',
          createdAt: ago(2),
        },
        {
          id: 'c_elias_studio',
          userId: ELIAS,
          text: '@mounika the restraint here is the whole point.',
          createdAt: ago(1.2),
        },
      ],
    },
    {
      id: 'p_leo_coast',
      userId: LEO,
      text: 'Pulled over for the marine layer on Highway 1. The radio was forgettable. The light was not. #coastal #film',
      media: { type: 'image', url: img('photo-1507525428034-b723cf961d3e') },
      tags: ['coastal', 'film'],
      likes: [MAYA, SOFIA, JONAH, PRIYA, NINA],
      shares: 6,
      savedBy: [MAYA, SOFIA],
      createdAt: ago(5),
      comments: [
        {
          id: 'c_maya_coast',
          userId: MAYA,
          text: 'Keep the grain. It feels like the morning actually felt.',
          createdAt: ago(4.2),
        },
        {
          id: 'c_jonah_coast',
          userId: JONAH,
          text: 'I can hear this photograph.',
          createdAt: ago(3.5),
        },
      ],
    },
    {
      id: 'p_theo_run',
      userId: THEO,
      text: 'Six easy miles before the city woke up. Nobody is timing this. #earlymiles',
      media: {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        poster: img('photo-1476480862126-209bfaa8edc8'),
      },
      tags: ['earlymiles'],
      likes: [JONAH, SOFIA, ELIAS],
      shares: 2,
      savedBy: [],
      createdAt: ago(7),
      comments: [
        {
          id: 'c_sofia_run',
          userId: SOFIA,
          text: 'This is the correct speed for a morning.',
          createdAt: ago(6),
        },
      ],
    },
    {
      id: 'p_sofia_lisbon',
      userId: SOFIA,
      text: 'Lisbon keeps its best rooms one staircase above the street. I climbed all of them. #lisbon #travel',
      media: { type: 'image', url: img('photo-1533105079780-92b9be482077') },
      tags: ['lisbon', 'travel'],
      likes: [MAYA, LEO, THEO, ELIAS],
      shares: 3,
      savedBy: [MAYA],
      createdAt: ago(8),
      comments: [
        {
          id: 'c_maya_lisbon',
          userId: MAYA,
          text: 'Send the restaurant with the green door.',
          createdAt: ago(7.2),
        },
        {
          id: 'c_priya_lisbon',
          userId: PRIYA,
          text: 'I need the pastry and the address, in that order.',
          createdAt: ago(6.4),
        },
      ],
    },
    {
      id: 'p_jonah_set',
      userId: JONAH,
      text: 'Soundcheck ran long and the room still felt generous. Grateful for loud, kind nights. #live',
      media: {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: img('photo-1470229722913-7c0e2dbbafd3'),
      },
      tags: ['live'],
      likes: [LEO, ELIAS, THEO, MAYA, SOFIA],
      shares: 5,
      savedBy: [LEO],
      createdAt: ago(10),
      comments: [
        {
          id: 'c_leo_set',
          userId: LEO,
          text: 'The amber light on the cymbals is unreal.',
          createdAt: ago(8),
        },
      ],
    },
    {
      id: 'p_priya_pasta',
      userId: PRIYA,
      text: 'Chili crisp pasta, lemon at the end, basil torn over the top. Weeknight and a little dramatic. #weeknights',
      media: { type: 'image', url: img('photo-1504674900247-0877df9cc836') },
      tags: ['weeknights'],
      likes: [MAYA, SOFIA, NINA, LEO],
      shares: 7,
      savedBy: [SOFIA, NINA],
      createdAt: ago(14),
      comments: [
        {
          id: 'c_maya_pasta',
          userId: MAYA,
          text: 'Lemon late, not early. I will be taking notes.',
          createdAt: ago(12),
        },
        {
          id: 'c_nina_pasta',
          userId: NINA,
          text: 'This looks like a good reason to stay in.',
          createdAt: ago(11),
        },
      ],
    },
    {
      id: 'p_elias_house',
      userId: ELIAS,
      text: 'The colonnade finally holds a shadow the way the model promised. Concrete can be gentle. #architecture',
      media: { type: 'image', url: img('photo-1487958449943-2429e8be8625') },
      tags: ['architecture'],
      likes: [NINA, THEO, JONAH, LEO],
      shares: 2,
      savedBy: [MAYA],
      createdAt: ago(18),
      comments: [
        {
          id: 'c_nina_house',
          userId: NINA,
          text: '@mounika you were right about the shadow line.',
          createdAt: ago(16),
        },
      ],
    },
    {
      id: 'p_sofia_cafe',
      userId: SOFIA,
      text: 'A corner table, one more coffee, and a notebook that is finally being used. #lisbon',
      media: { type: 'image', url: img('photo-1517248135467-4c7edcad34c4') },
      tags: ['lisbon'],
      likes: [MAYA, PRIYA, NINA],
      shares: 1,
      savedBy: [],
      createdAt: ago(22),
      comments: [],
    },
    {
      id: 'p_nina_essay',
      userId: NINA,
      text: 'Attention is a room you furnish. I am writing about slow mornings, open tabs, and the objects we leave in reach on purpose. #attention',
      media: null,
      tags: ['attention'],
      likes: [MAYA, PRIYA, ELIAS, SOFIA],
      shares: 4,
      savedBy: [MAYA, ELIAS],
      createdAt: ago(28),
      comments: [
        {
          id: 'c_maya_essay',
          userId: MAYA,
          text: 'Use the studio frame if it helps the second paragraph.',
          createdAt: ago(24),
        },
        {
          id: 'c_elias_essay',
          userId: ELIAS,
          text: 'That first sentence can carry the piece.',
          createdAt: ago(20),
        },
      ],
    },
    {
      id: 'p_leo_portrait',
      userId: LEO,
      text: 'Portraits go better when nobody is performing. Five frames, then we ate sandwiches. #film',
      media: { type: 'image', url: img('photo-1524504388940-b1c1722653e1') },
      tags: ['film'],
      likes: [MAYA, SOFIA, JONAH],
      shares: 1,
      savedBy: [],
      createdAt: ago(46),
      comments: [
        {
          id: 'c_sofia_portrait',
          userId: SOFIA,
          text: 'The unposed one is the one.',
          createdAt: ago(40),
        },
      ],
    },
    {
      id: 'p_maya_notes',
      userId: MAYA,
      text: 'Pinned the week where I can see it. If it does not fit on paper, it does not fit in the sprint. #studio',
      media: { type: 'image', url: img('photo-1515378791036-0648a3ef77b2') },
      tags: ['studio'],
      likes: [NINA, LEO, PRIYA],
      shares: 1,
      savedBy: [NINA],
      createdAt: ago(70),
      comments: [],
    },
    {
      id: 'p_nina_books',
      userId: NINA,
      text: 'The shop on the corner still lets you stand in the aisle and read the first page. #reading',
      media: { type: 'image', url: img('photo-1519681393784-d120267933ba') },
      tags: ['reading'],
      likes: [MAYA, ELIAS, SOFIA],
      shares: 2,
      savedBy: [],
      createdAt: ago(90),
      comments: [
        {
          id: 'c_maya_books',
          userId: MAYA,
          text: 'I left with a book I did not mean to buy. Correct outcome.',
          createdAt: ago(80),
        },
      ],
    },
    {
      id: 'p_jonah_bus',
      userId: JONAH,
      text: 'Night bus home, guitar at my feet, city doing its softest impression of quiet. #nightbus',
      media: null,
      tags: ['nightbus'],
      likes: [LEO, THEO],
      shares: 0,
      savedBy: [],
      createdAt: ago(100),
      comments: [],
    },
    {
      id: 'p_maya_walk',
      userId: MAYA,
      text: 'Walked home the long way. Hyderabad does this color for about twelve minutes. #hyderabad',
      media: { type: 'image', url: img('photo-1480714378408-67cf0d13bc1b') },
      tags: ['hyderabad'],
      likes: [SOFIA, LEO, NINA],
      shares: 2,
      savedBy: [SOFIA],
      createdAt: ago(120),
      comments: [
        {
          id: 'c_sofia_walk',
          userId: SOFIA,
          text: 'Twelve minutes is plenty if you are paying attention.',
          createdAt: ago(110),
        },
      ],
    },
  ];

  const stories = [
    {
      id: 's_maya_1',
      userId: MAYA,
      mediaType: 'image',
      image: img('photo-1515378791036-0648a3ef77b2', 900),
      createdAt: ago(4),
      seenBy: [MAYA],
    },
    {
      id: 's_leo_1',
      userId: LEO,
      mediaType: 'image',
      image: img('photo-1507525428034-b723cf961d3e', 900),
      createdAt: ago(2),
      seenBy: [],
    },
    {
      id: 's_leo_2',
      userId: LEO,
      mediaType: 'image',
      image: img('photo-1469854523086-cc02fe5d8800', 900),
      createdAt: ago(1.5),
      seenBy: [],
    },
    {
      id: 's_sofia_1',
      userId: SOFIA,
      mediaType: 'image',
      image: img('photo-1533105079780-92b9be482077', 900),
      createdAt: ago(3),
      seenBy: [],
    },
    {
      id: 's_priya_1',
      userId: PRIYA,
      mediaType: 'image',
      image: img('photo-1414235077428-338989a2e8c0', 900),
      createdAt: ago(6),
      seenBy: [],
    },
    {
      id: 's_jonah_1',
      userId: JONAH,
      mediaType: 'image',
      image: img('photo-1470229722913-7c0e2dbbafd3', 900),
      createdAt: ago(5),
      seenBy: [],
    },
    {
      id: 's_theo_1',
      userId: THEO,
      mediaType: 'image',
      image: img('photo-1476480862126-209bfaa8edc8', 900),
      createdAt: ago(8),
      seenBy: [],
    },
    {
      id: 's_elias_1',
      userId: ELIAS,
      mediaType: 'image',
      image: img('photo-1487958449943-2429e8be8625', 900),
      createdAt: ago(9),
      seenBy: [MAYA],
    },
  ];

  const notifications = [
    {
      id: 'n1',
      userId: MAYA,
      type: 'like',
      fromUserId: LEO,
      postId: 'p_maya_studio',
      text: '',
      createdAt: minsAgo(18),
      read: false,
    },
    {
      id: 'n2',
      userId: MAYA,
      type: 'comment',
      fromUserId: SOFIA,
      postId: 'p_maya_studio',
      text: 'The calm in this frame is doing a lot of work.',
      createdAt: minsAgo(70),
      read: false,
    },
    {
      id: 'n3',
      userId: MAYA,
      type: 'follow',
      fromUserId: JONAH,
      postId: null,
      text: '',
      createdAt: ago(3),
      read: false,
    },
    {
      id: 'n4',
      userId: MAYA,
      type: 'share',
      fromUserId: PRIYA,
      postId: 'p_maya_studio',
      text: '',
      createdAt: ago(6),
      read: true,
    },
    {
      id: 'n5',
      userId: MAYA,
      type: 'like',
      fromUserId: NINA,
      postId: 'p_maya_notes',
      text: '',
      createdAt: ago(26),
      read: true,
    },
    {
      id: 'n6',
      userId: MAYA,
      type: 'mention',
      fromUserId: ELIAS,
      postId: 'p_maya_studio',
      text: '@mounika the restraint here is the whole point.',
      createdAt: ago(30),
      read: true,
    },
    {
      id: 'n7',
      userId: MAYA,
      type: 'comment',
      fromUserId: SOFIA,
      postId: 'p_maya_walk',
      text: 'Twelve minutes is plenty if you are paying attention.',
      createdAt: ago(110),
      read: true,
    },
  ];

  const conversations = [
    {
      id: 'c_leo',
      participantIds: [MAYA, LEO],
      unreadBy: { [MAYA]: 1, [LEO]: 0 },
      messages: [
        {
          id: 'm_leo_1',
          senderId: LEO,
          text: 'The Highway 1 frames are back. I kept the grain a little heavier on the second roll.',
          createdAt: ago(26),
        },
        {
          id: 'm_leo_2',
          senderId: MAYA,
          text: 'Heavier works. The first frame feels like the morning actually felt.',
          createdAt: ago(25),
        },
        {
          id: 'm_leo_3',
          senderId: LEO,
          text: 'I will send a contact sheet tonight. Are you still open to art directing the spring series?',
          createdAt: ago(24),
        },
        {
          id: 'm_leo_4',
          senderId: MAYA,
          text: 'Yes. I blocked Thursday. Bring the prints, not just the laptop.',
          createdAt: ago(23),
        },
        {
          id: 'm_leo_5',
          senderId: LEO,
          text: 'Just parked at the studio. Prints are in the passenger seat.',
          createdAt: minsAgo(42),
        },
      ],
    },
    {
      id: 'c_sofia',
      participantIds: [MAYA, SOFIA],
      unreadBy: { [MAYA]: 0, [SOFIA]: 0 },
      messages: [
        {
          id: 'm_sofia_1',
          senderId: SOFIA,
          text: 'Lisbon was all tiled staircases and late dinners. You would have filled a notebook.',
          createdAt: ago(50),
        },
        {
          id: 'm_sofia_2',
          senderId: MAYA,
          text: 'Send me the restaurant with the green door.',
          createdAt: ago(49),
        },
        {
          id: 'm_sofia_3',
          senderId: SOFIA,
          text: 'Already saving it for you. Come in May if you can.',
          createdAt: ago(48),
        },
      ],
    },
    {
      id: 'c_priya',
      participantIds: [MAYA, PRIYA],
      unreadBy: { [MAYA]: 1, [PRIYA]: 0 },
      messages: [
        {
          id: 'm_priya_1',
          senderId: PRIYA,
          text: 'I tested the chili crisp pasta again. You were right about the lemon.',
          createdAt: ago(15),
        },
        {
          id: 'm_priya_2',
          senderId: MAYA,
          text: 'Lemon late, not early. Did the basil stay in?',
          createdAt: ago(14.5),
        },
        {
          id: 'm_priya_3',
          senderId: PRIYA,
          text: 'Torn in at the end. I am posting it tonight — brace yourself.',
          createdAt: ago(14),
        },
      ],
    },
    {
      id: 'c_nina',
      participantIds: [MAYA, NINA],
      unreadBy: { [MAYA]: 0, [NINA]: 0 },
      messages: [
        {
          id: 'm_nina_1',
          senderId: NINA,
          text: 'Drafted the piece on slow mornings. May I use your studio photo beside the second paragraph?',
          createdAt: ago(30),
        },
        {
          id: 'm_nina_2',
          senderId: MAYA,
          text: 'Use it. Send me the line you will place under it so I can crop for the headline.',
          createdAt: ago(29),
        },
        {
          id: 'm_nina_3',
          senderId: NINA,
          text: 'Attention is a room you furnish. Too much?',
          createdAt: ago(28.5),
        },
        {
          id: 'm_nina_4',
          senderId: MAYA,
          text: 'It is the right amount.',
          createdAt: ago(28),
        },
      ],
    },
  ];

  const social = { posts, stories, notifications, conversations };
  assertSeed(users, social);
  return { users, social };
}
