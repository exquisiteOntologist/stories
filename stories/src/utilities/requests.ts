// import { Fetcher } from 'openapi-typescript-fetch'
// import { paths } from '../data/openapi'

// const apiBase = 'http://localhost:5001';

// // declare fetcher for paths
// // const fetcher = Fetcher.for<paths>()

// // global configuration
// fetcher.configure({
//   baseUrl: apiBase, // 'https://petstore.swagger.io/v2',
//   init: {
//     headers: {
//     //   
//     },
//     mode: 'cors'
//   },
//   use: [] // middlewares
// })

// export const getSourcesOfCollection = fetcher.path('/api/Content/get-sources-of-collection').method('get').create()
// export const getSources = fetcher.path('/api/Content/get-sources').method('get').create()
// export const getSourcesContents = fetcher.path('/api/Content/get-sources-contents').method('get').create()
// export const getContents = fetcher.path('/api/Content/get-contents').method('get').create()
// export const getContentBodies = fetcher.path('/api/Content/get-content-bodies').method('get').create()

// export const postAddSource = fetcher.path('/api/Collection/add-source').method('post').create()