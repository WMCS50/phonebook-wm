const Persons = ({filteredList, handleDelete}) => {
       
    return(
        <div>
        {filteredList.map((item) => 
          <div 
            key={item.id}> {item.name} {item.number}
            <button onClick={() => handleDelete(item)}>delete</button>
          </div> 
        )}
        </div>
    )
}

export default Persons;