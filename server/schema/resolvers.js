

const resolvers = {
    Query:{
        users:() => [],
    },
    Mutation:{
        signUp: async(_, data) => {
            console.log(data);
        },

        signIn: async(_, data) => {
            console.log(data);
        },
    }
}


module.exports = {resolvers}