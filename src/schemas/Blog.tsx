import { buildSchema } from 'graphql';

const blogSchema = buildSchema(`

type Blog {
    id: Int!
    title: String!
    content: String!
    author: User!
    creationDate: Date!
  }
  
  input CreateBlogInput {
    title: String!
    content: String!
    authorId: Int!
    creationDate: Date!
  }
  
  input UpdateBlogInput {
    id: Int!
    title: String
    content: String
    authorId: Int
    creationDate: Date
  }
  input getBlogInput{
    id: Int!
  }
  
  type Query {
    getBlog(id: Int!): Blog
    getAllBlogs: [Blog]
    getBlogByTitle(title:String!): [Blog]
    getBlogByContent(content:String!): [Blog]
    getBlogByAuthor(author:User!): [Blog]
    getBlogByDate(date:String!): [Blog]
  }
  
  type Mutation {
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(input: UpdateBlogInput!): Blog!
    deleteBlog(input: GetBlogInput!): Blog!
  }
`);
export default blogSchema;