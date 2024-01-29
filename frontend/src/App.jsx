import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from './services/person';
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  //fetch initial data from json server

   useEffect(() => {
    personsService.getAll()
      .then(response => setPersons(response))
      .catch(error => console.error(error))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    //if duplicate, don't add but ask to override existing number
    const checkPerson = persons.find(person => person.name.toLowerCase() === 
    personObject.name.toLowerCase())

    const updatedPerson = { ...checkPerson, number: newNumber}

    if (checkPerson) {
      window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)
      personsService.update(checkPerson.id, updatedPerson)
        .then(update => {
          setPersons(persons.map(person => person.id !== checkPerson.id ? person: update))})
          .catch(error => {
            if (error.response.status === 404) {
              setNotification({
                text: `${checkPerson.name} has already been removed from server`,
                type: 'error'
              })
            } else {
              setNotification({
                text: error.response.data.error,
                type: 'error'
              })
            }
          })
        setNotification({
          text: `Note ${checkPerson.name}'s number has been updated`,
          type: 'notification'})
        setTimeout(() => {setNotification(null)}, 5000)
      setNewName('')
      setNewNumber('')
    } else {
      personsService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))})
        .catch(error => {
          setNotification({
            text: error.response.data.error,
            type: 'error'
          })
        })
        setNotification({
          text: `${personObject.name} has been added to the phonebook`,
          type: 'notification'})
        setTimeout(() => {setNotification(null)}, 5000)
      setNewName('')
      setNewNumber('')
    }
  }

  //filter by name
  const filteredList = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  console.log('filtered list', filteredList)


  const handleAddName = (event) => {
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log('handleFilterChange', event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`))
      personsService.deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter((item) => item.id !== person.id))
        })
        .catch(error => console.error(error))
  }

  return (
    <div>
      <Notification notification={notification}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      
      <h2>Phonebook</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleAddName={handleAddName}
        newNumber={newNumber}
        handleAddNumber={handleAddNumber}
      />
      
      <h2>Numbers</h2>
      <Persons filteredList={filteredList} handleDelete={handleDelete}/>

    </div>
  )
}

export default App