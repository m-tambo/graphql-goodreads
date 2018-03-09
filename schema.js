const fetch = require('node-fetch')
const { parseString } = require('xml2js')
const { promisify } = require('util')
const parseXML = promisify(parseString) // old pgk that doesn't suuport promises

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLInt,
    GraphQLString 
} = require('graphql')

const API_KEY = require('./.env')
const url = 'https://www.goodreads.com'
const authorId = '4178'

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => // this comes from the parsed fetch
                xml.GoodreadsResponse.author[0].name[0] 
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
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) => 
                    fetch(`${url}/author/show.xml?id=${args.id}&key=${API_KEY}`)
                        .then(response => response.text())  // handle the xml
                        .then(parseXML)
            }
        })
    })
})
