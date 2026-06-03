// ── Mock data for all War Rooms screens ─────────────────────────────────────

export type RoomStatus = 'waiting' | 'starting' | 'live'
export type Difficulty  = 'Easy' | 'Medium' | 'Hard' | 'Mixed'
export type RoomMode    = 'Battle' | 'Practice'
export type PlayerStatus =
  | 'thinking' | 'running' | 'wrong_answer' | 'time_limit_exceeded'
  | 'runtime_error' | 'accepted' | 'disconnected' | 'ready' | 'not_ready'

export interface MockPlayer {
  id: string
  username: string
  rank: string
  rating: number
  status: PlayerStatus
  isHost: boolean
  isReady: boolean
  avatarColor: string
}

export interface MockRoom {
  id: string
  name: string
  host: string
  difficulty: Difficulty
  mode: RoomMode
  players: number
  maxPlayers: number
  duration: string
  status: RoomStatus
  language: string[]
  createdAt: string
}

export interface MockProblem {
  id: number
  name: string
  difficulty: Difficulty
  acceptance: string
  tags: string[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  estimatedTime: string
  nominatedBy?: string
}

export interface LeaderboardEntry {
  rank: number
  player: MockPlayer
  score: number
  accepted: boolean
  attempts: number
  submissionTime: string
  runtime: string
  memory: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'system' | 'achievement'
  author?: string
  content: string
  time: string
}

export interface MatchHistoryEntry {
  id: string
  date: string
  problem: string
  difficulty: Difficulty
  winner: string
  players: string[]
  duration: string
  result: 'Win' | 'Loss' | 'Draw'
  mode: RoomMode
  myScore: number
  myRank: number
}

// ── Players ──────────────────────────────────────────────────────────────────

export const MOCK_PLAYERS: MockPlayer[] = [
  {
    id: 'p1', username: 'sivaprasad', rank: 'Expert', rating: 1847,
    status: 'accepted', isHost: true, isReady: true, avatarColor: '#7C3AED',
  },
  {
    id: 'p2', username: 'priya_codes', rank: 'Master', rating: 2103,
    status: 'thinking', isHost: false, isReady: true, avatarColor: '#0891B2',
  },
  {
    id: 'p3', username: 'alex_dev', rank: 'Specialist', rating: 1512,
    status: 'running', isHost: false, isReady: true, avatarColor: '#059669',
  },
  {
    id: 'p4', username: 'john_b', rank: 'Pupil', rating: 1234,
    status: 'wrong_answer', isHost: false, isReady: false, avatarColor: '#D97706',
  },
]

// ── Rooms ─────────────────────────────────────────────────────────────────────

export const MOCK_ROOMS: MockRoom[] = [
  {
    id: 'room-alpha-42',
    name: 'Algorithm Duel #42',
    host: 'sivaprasad',
    difficulty: 'Medium',
    mode: 'Battle',
    players: 2,
    maxPlayers: 4,
    duration: '30 min',
    status: 'waiting',
    language: ['python', 'javascript'],
    createdAt: '2 min ago',
  },
  {
    id: 'room-dp-masters',
    name: 'DP Masters Showdown',
    host: 'priya_codes',
    difficulty: 'Hard',
    mode: 'Battle',
    players: 4,
    maxPlayers: 4,
    duration: '45 min',
    status: 'live',
    language: ['python', 'cpp', 'java'],
    createdAt: '18 min ago',
  },
  {
    id: 'room-beginner',
    name: 'Beginner Friendly',
    host: 'alex_dev',
    difficulty: 'Easy',
    mode: 'Practice',
    players: 1,
    maxPlayers: 2,
    duration: '15 min',
    status: 'waiting',
    language: ['python', 'javascript'],
    createdAt: '5 min ago',
  },
  {
    id: 'room-mixed-bag',
    name: 'Friday Night Code-Off',
    host: 'john_b',
    difficulty: 'Mixed',
    mode: 'Battle',
    players: 3,
    maxPlayers: 6,
    duration: '60 min',
    status: 'starting',
    language: ['python', 'javascript', 'cpp', 'java'],
    createdAt: '1 min ago',
  },
  {
    id: 'room-graphs-only',
    name: 'Graph Theory Arena',
    host: 'graph_king',
    difficulty: 'Hard',
    mode: 'Battle',
    players: 2,
    maxPlayers: 4,
    duration: '45 min',
    status: 'live',
    language: ['cpp', 'java'],
    createdAt: '32 min ago',
  },
  {
    id: 'room-strings',
    name: 'String Manipulation 101',
    host: 'string_wizard',
    difficulty: 'Easy',
    mode: 'Practice',
    players: 2,
    maxPlayers: 4,
    duration: '15 min',
    status: 'waiting',
    language: ['python', 'javascript'],
    createdAt: '8 min ago',
  },
]

// ── Problems ──────────────────────────────────────────────────────────────────

export const MOCK_PROBLEMS: MockProblem[] = [
  {
    id: 1,
    name: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '52.3%',
    tags: ['Array', 'Hash Table'],
    estimatedTime: '15 min',
    nominatedBy: 'sivaprasad',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to* \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.',
    ],
  },
  {
    id: 20,
    name: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptance: '40.8%',
    tags: ['String', 'Stack'],
    estimatedTime: '20 min',
    nominatedBy: 'priya_codes',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10⁴',
      's consists of parentheses only \'()[]{}\' ',
    ],
  },
  {
    id: 53,
    name: 'Maximum Subarray',
    difficulty: 'Medium',
    acceptance: '50.4%',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    estimatedTime: '25 min',
    nominatedBy: 'alex_dev',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: [
      '1 <= nums.length <= 10⁵',
      '-10⁴ <= nums[i] <= 10⁴',
    ],
  },
]

// ── Leaderboard ───────────────────────────────────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1, player: MOCK_PLAYERS[0], score: 320, accepted: true,
    attempts: 1, submissionTime: '12:31 PM', runtime: '48ms', memory: '14.2MB',
  },
  {
    rank: 2, player: MOCK_PLAYERS[1], score: 280, accepted: true,
    attempts: 2, submissionTime: '12:35 PM', runtime: '52ms', memory: '15.1MB',
  },
  {
    rank: 3, player: MOCK_PLAYERS[2], score: 180, accepted: false,
    attempts: 3, submissionTime: '—', runtime: '—', memory: '—',
  },
  {
    rank: 4, player: MOCK_PLAYERS[3], score: 60, accepted: false,
    attempts: 4, submissionTime: '—', runtime: '—', memory: '—',
  },
]

// ── Chat Messages ─────────────────────────────────────────────────────────────

export const MOCK_CHAT: ChatMessage[] = [
  { id: 'c1', type: 'system',  content: 'Room created by sivaprasad', time: '12:20 PM' },
  { id: 'c2', type: 'system',  content: 'priya_codes joined the room', time: '12:21 PM' },
  { id: 'c3', type: 'system',  content: 'alex_dev joined the room', time: '12:22 PM' },
  { id: 'c4', type: 'system',  content: 'john_b joined the room', time: '12:22 PM' },
  { id: 'c5', type: 'system',  content: 'Battle started — Two Sum', time: '12:25 PM' },
  { id: 'c6', type: 'user',    author: 'alex_dev', content: 'Good luck everyone 🤞', time: '12:26 PM' },
  { id: 'c7', type: 'user',    author: 'priya_codes', content: 'hashmap lets go', time: '12:27 PM' },
  { id: 'c8', type: 'achievement', content: 'sivaprasad submitted a solution', time: '12:31 PM' },
  { id: 'c9', type: 'system',  content: 'sivaprasad — Accepted ✓', time: '12:31 PM' },
  { id: 'c10', type: 'user',   author: 'john_b', content: 'gg priya 😅', time: '12:32 PM' },
  { id: 'c11', type: 'achievement', content: 'priya_codes submitted a solution', time: '12:35 PM' },
  { id: 'c12', type: 'system', content: 'priya_codes — Accepted ✓', time: '12:35 PM' },
]

// ── Activity Feed (Lobby) ─────────────────────────────────────────────────────

export const MOCK_ACTIVITY = [
  { id: 'a1', content: 'Room created', time: '2 min ago',  type: 'system' as const },
  { id: 'a2', content: 'priya_codes joined', time: '1 min ago', type: 'join' as const },
  { id: 'a3', content: 'alex_dev joined', time: '45s ago', type: 'join' as const },
  { id: 'a4', content: 'john_b joined', time: '30s ago', type: 'join' as const },
  { id: 'a5', content: 'sivaprasad marked ready', time: '20s ago', type: 'ready' as const },
  { id: 'a6', content: 'priya_codes marked ready', time: '15s ago', type: 'ready' as const },
  { id: 'a7', content: 'alex_dev marked ready', time: '10s ago', type: 'ready' as const },
]

// ── Battle Submission Timeline ────────────────────────────────────────────────

export const MOCK_TIMELINE = [
  { time: '12:31 PM', player: 'sivaprasad', event: 'Submitted solution',    status: 'pending' as const },
  { time: '12:31 PM', player: 'sivaprasad', event: 'Accepted ✓',            status: 'accepted' as const },
  { time: '12:32 PM', player: 'priya_codes', event: 'Submitted solution',   status: 'pending' as const },
  { time: '12:32 PM', player: 'priya_codes', event: 'Wrong Answer',         status: 'error' as const },
  { time: '12:34 PM', player: 'alex_dev',   event: 'Submitted solution',    status: 'pending' as const },
  { time: '12:34 PM', player: 'alex_dev',   event: 'Time Limit Exceeded',   status: 'error' as const },
  { time: '12:35 PM', player: 'priya_codes', event: 'Submitted solution',   status: 'pending' as const },
  { time: '12:35 PM', player: 'priya_codes', event: 'Accepted ✓',           status: 'accepted' as const },
]

// ── Match History ─────────────────────────────────────────────────────────────

export const MOCK_HISTORY: MatchHistoryEntry[] = [
  {
    id: 'h1', date: 'May 28, 2026', problem: 'Two Sum', difficulty: 'Easy',
    winner: 'sivaprasad', players: ['sivaprasad', 'priya_codes', 'alex_dev', 'john_b'],
    duration: '6 min 12s', result: 'Win', mode: 'Battle', myScore: 320, myRank: 1,
  },
  {
    id: 'h2', date: 'May 27, 2026', problem: 'Valid Parentheses', difficulty: 'Easy',
    winner: 'priya_codes', players: ['sivaprasad', 'priya_codes'],
    duration: '8 min 45s', result: 'Loss', mode: 'Battle', myScore: 210, myRank: 2,
  },
  {
    id: 'h3', date: 'May 27, 2026', problem: 'Maximum Subarray', difficulty: 'Medium',
    winner: 'sivaprasad', players: ['sivaprasad', 'alex_dev', 'john_b'],
    duration: '14 min 20s', result: 'Win', mode: 'Battle', myScore: 290, myRank: 1,
  },
  {
    id: 'h4', date: 'May 26, 2026', problem: 'Merge Two Sorted Lists', difficulty: 'Easy',
    winner: 'john_b', players: ['sivaprasad', 'john_b', 'priya_codes'],
    duration: '11 min 5s', result: 'Loss', mode: 'Practice', myScore: 180, myRank: 3,
  },
  {
    id: 'h5', date: 'May 25, 2026', problem: 'Climbing Stairs', difficulty: 'Easy',
    winner: 'sivaprasad', players: ['sivaprasad', 'priya_codes'],
    duration: '4 min 38s', result: 'Win', mode: 'Battle', myScore: 340, myRank: 1,
  },
  {
    id: 'h6', date: 'May 24, 2026', problem: 'Container With Most Water', difficulty: 'Medium',
    winner: 'priya_codes', players: ['sivaprasad', 'priya_codes', 'alex_dev'],
    duration: '19 min 50s', result: 'Loss', mode: 'Battle', myScore: 240, myRank: 2,
  },
  {
    id: 'h7', date: 'May 23, 2026', problem: 'Coin Change', difficulty: 'Medium',
    winner: 'sivaprasad', players: ['sivaprasad', 'john_b'],
    duration: '22 min 14s', result: 'Win', mode: 'Battle', myScore: 270, myRank: 1,
  },
  {
    id: 'h8', date: 'May 22, 2026', problem: 'Word Break', difficulty: 'Hard',
    winner: 'priya_codes', players: ['sivaprasad', 'priya_codes', 'alex_dev', 'john_b'],
    duration: '41 min 7s', result: 'Loss', mode: 'Battle', myScore: 150, myRank: 3,
  },
]

// ── Platform Stats ────────────────────────────────────────────────────────────

export const PLATFORM_STATS = {
  activeRooms: 24,
  playersOnline: 138,
  battlesToday: 312,
  avgDuration: '18 min',
}

// ── Solution code samples ─────────────────────────────────────────────────────

export const SOLUTION_CODES: Record<string, string> = {
  sivaprasad: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,

  priya_codes: `def twoSum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,

  alex_dev: `def two_sum(nums, target):
    d = {}
    for idx, val in enumerate(nums):
        if target - val in d:
            return [d[target - val], idx]
        d[val] = idx`,

  john_b: `def twoSum(nums, target):
    # brute force
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] + nums[j] == target:
                return [i, j]`,
}
