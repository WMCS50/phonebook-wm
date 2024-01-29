import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons' 

//get initial data
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//save added numbers
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

//delete a person
const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const update = (id, personObject) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject)
  return request.then(response => response.data)
}

export default { getAll, create, deletePerson, update }