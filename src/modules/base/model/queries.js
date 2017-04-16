export default `
posts: [Post]
allTodos(filter:String): [Todo]

proxyRequest(endpoint:String,method:String,headers:JSON,params:JSON,path:String): JSON
`;
