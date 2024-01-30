const express = require('express')
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()
const app = express()

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms :POST'))

logger.token('POST', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

//gets all entries
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//gets info
app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>`)
  })
    .catch(error => next(error))
})

//gets specific id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//deletes entry

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//updates entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//creates entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

//error handling
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})