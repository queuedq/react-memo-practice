import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import session from 'express-session'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import historyApiFallback from 'connect-history-api-fallback'
// import path from 'path'

import api from './routes'

import config from '../webpack.config'

const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? process.env.PORT : 3000
// const distPath = path.resolve(__dirname, '../dist') // production

const app = express()
const compiler = webpack(config)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => { console.log('Connected to mongodb server') })
// mongoose.connect('mongodb://username:password@host:port/database=')
mongoose.connect('mongodb://react-memo:react-memo@localhost/react-memo')

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(session({
  secret: '9e9f9cb46efa5c619dbe452848ae38eb745e7536',
  resave: false,
  saveUninitialized: true
}))

// Routes
app.use('/api', api)
// Client-side routing
app.use(historyApiFallback())
app.use(webpackMiddleware(compiler, { // development
  publicPath: '/'
}))
// app.get('*', (req, res) => { // production
//   res.sendFile(path.resolve(__dirname, './../dist/index.html'))
// })

// Listen
app.listen(port, () => {
  console.log('Server running on port ' + port)
})
