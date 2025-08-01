type User = {
  email: string
  name: string
  image: string
  password: string
  age: number
  createdAt: Date
  role: "user" | "admin"
}

export const messages = [
  "Welcome to the team! 🎉",
  "Meeting now! Lets go!",
]

export const initUsersData: User[] = [
  {
    email: "user1@example.com",
    name: "User One",
    image:
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairCurly&hairColor=Blonde&facialHairType=MoustacheFancy&facialHairColor=Auburn&clotheType=GraphicShirt&clotheColor=PastelYellow&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown",
    password:
      "035f373274a799f11bae5745fbeefc73:214c6c33b8dcb6ed279c35b8c8ad4ee2c5dcd0798a434616ab124f0c25ee1707b550ce0817154def9c3279bfac566d2d08c635766d41004a502ee745a644c923", // hashed version. non-hashed is "securePassword"
    age: 29,
    createdAt: new Date("2024-01-13T12:12:26Z"),
    role: "admin",
  },
  {
    email: "user2@example.com",
    name: "User Two",
    image:
      "https://avataaars.io/?avatarStyle=Transparent&topType=Hat&hatColor=Blue03&clotheType=BlazerSweater&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Smile&skinColor=Pale",
    password:
      "035f373274a799f11bae5745fbeefc73:214c6c33b8dcb6ed279c35b8c8ad4ee2c5dcd0798a434616ab124f0c25ee1707b550ce0817154def9c3279bfac566d2d08c635766d41004a502ee745a644c923", // hashed version. non-hashed is "securePassword"
    age: 34,
    createdAt: new Date("2024-01-14T12:12:26Z"),
    role: "user",
  },
]