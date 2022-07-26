const {ApolloServer, gql} = require("apollo-server")
const {MongoClient} = require("mongodb")
// const {typeDefs} = require("./schema/Typedefs.graphql")
// const {resolvers} = require("./schema/resolvers")
const dotenv = require("dotenv")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config()


const {DB_URL, DB_NAME, JWT_SECRET} = process.env


const getToken = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30 days' });

const getUserFromToken = async (token, db) => {
    if (!token) { return null }
  
    const tokenData = jwt.verify(token, JWT_SECRET);
    if (!tokenData?.id) {
      return null;
    }
    return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) });
  }



const typeDefs = gql`
type Query {
    users: [User!]!
  },

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

  }
  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }
  input SignInInput {
    email: String!
    password: String!
  }
  type AuthUser {
    user: User!
    token: String!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

`;

const resolvers = {
     
    Query:{
        users:() => [],
    },
    Mutation:{
        signUp: async(_, {input}, {db}) => {
            const hashedPassword = bcrypt.hashSync(input.password)
            const newUser = {
                ...input,
                password: hashedPassword
            }

            const result = await db.collection("Users").insertOne(newUser)
            const user = result.ops[0]
            console.log(getToken(user));
            return{
                user,
                token: getToken(user)
            }
          
        },

        signIn: async (_, { input }, { db }) => {
            const user = await db.collection('Users').findOne({ email: input.email });
            const isPasswordCorrect = user && bcrypt.compareSync(input.password, user.password);
      
            if (!user || !isPasswordCorrect) {
              throw new Error('Invalid credentials!');
            }
      
            return {
              user,
              token: getToken(user),
            }
          },

        
      
    },
    User: {
        id: ({ _id, id }) => _id || id,
       },
}

const start = async() => {
    try {
        const client = new MongoClient(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        await client.connect()
        const db = client.db(DB_NAME)
        console.log("Database connected successfully");
       

        const server = new ApolloServer({ typeDefs, resolvers,
            context: async ({ req }) => {
                const user = await getUserFromToken(req.headers.authorization, db);
                return {
                  db,
                  user,
                }
              },
        })

        server.listen().then(({url}) => {
            console.log(`🚀 Server ready ${url}`);
        })
    } catch (error) {
      console.log(error);   
    }

  
   
}

start()