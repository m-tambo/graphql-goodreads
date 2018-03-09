const fetch = require('node-fetch')
const { parseString } = require('xml2js')
const { promisify } = require('util')
const parseXML = promisify(parseString) // old pgk that doesn't suuport promises

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLInt,
    GraphQLString,
    GraphQLList 
} = require('graphql')

const API_KEY = require('./.env')
const url = 'https://www.goodreads.com'

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'list of books',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.isbn[0]
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '',

    fields: () => ({
        name: {
            type: GraphQLString,
                // dig into the (parsed) fetched xml for the author name
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]  
        },
        books: {
            type: GraphQLList(BookType),
            resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
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
