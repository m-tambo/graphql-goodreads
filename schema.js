const fetch = require('node-fetch')
const { parseString } = require('xml2js')
const { promisify } = require('util')
const parseXML = promisify(parseString) // old pgk that doesn't suuport promises

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQlInt,
    GraphQLString 
} = require('graphql')

const API_KEY = '4178&key=qnAZJo5kdbG0SE4Yy97Njw' // require('./.env')
const url = 'https://www.goodreads.com'
const authorId = '4178'

fetch(`${url}/author/show.xml?id=${authorId}&key=${API_KEY}`)
    .then(response => response.text())  // handle the xml
    .then(parseXML)


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '',

    fields: () => ({
        name: {
            type: GraphQLString
        } 
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'some description',
        
        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQlInt }
                }
            }
        })
    })
})
