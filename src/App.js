import React ,{useState} from 'react';
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'; //DragDropContext is whole area to work with, droppable is drop zone and Draggable is the item to drag
import uuid from "uuid/v4";

const itemsFromBackend=[ //each of these is mapped over for generating a movable tab
{id:uuid(),content:'Stephen'},
{id:uuid(),content:'Paul'},
{id:uuid(),content:'Joseph'},
{id:uuid(),content:'Claire'},
{id:uuid(),content:'Ian'}
];

const columnsFromBackend= //each column will need a unique ID- using uuid for this
{
  [uuid()]:{
    name:'Todo',
    items:itemsFromBackend
  },
  [uuid()]:{
    name:'In Progress',
    items:[]
  }
};

const onDragEnd=(result,columns,setColumns)=>{
  if(!result.destination) return;
  const {source,destination}=result; //destructures? mimics items from result?
  const column=columns[source.droppableId]; //one column is the result of source column ID
  const copiedItems=[...column.items] //copy the items within source column and 'flatten'
  const [removed]=copiedItems.splice(source.index,1);
  copiedItems.splice(destination.index,0,removed);//take new copied items array and splice at current index for 0 spaces
  setColumns({ //change the state of 'columns' to match the parsed in data
    ...columns,
    [source.droppableId]:{
      ...column,
      items:copiedItems
    }
  })
};

function App() {
  const [columns,setColumns]=useState(columnsFromBackend);

  return (
    <div style={{display:'flex', justifyContent:'center', height:'100%'}}>
    <DragDropContext onDragEnd={result=>onDragEnd(result,columns,setColumns)}>
    {Object.entries(columns).map(([id,column])=>{
      return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h2>{column.name}</h2>
        <div style={{margin:8}}>
        <Droppable droppableId={id} key={id}>
        {(provided,snapshot)=>{
          return(
            <div {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              background:snapshot.isDraggingOver? 'lightblue':'lightgrey',
              padding:4,
              width:250,
              minHeight:500
            }}
            >
            {column.items.map((item,index)=>{
              return(
                <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided,snapshot)=>{
                  return(
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect:'none',
                      padding:16,
                      margin:'0 0 8px 0',
                      minHeight:'50px',
                      backgroundColor: snapshot.isDragging? '#263B4A':'#456C86',
                      color:'white',
                      border:"1px dotted black",
                      ...provided.draggableProps.style
                    }}
                    >
                    {item.content}
                    </div>
                  )
                }}
                </Draggable>
              )
            })}
            {provided.placeholder}
            </div>
          )
        }}
        </Droppable>
        </div>
        </div>
      )
    })}


    </DragDropContext>
    </div>
  );
}

export default App;
