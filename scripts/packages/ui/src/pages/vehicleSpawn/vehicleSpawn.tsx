import React, { useState, useEffect } from 'react'
import { usePageContext } from '../../App'
import { fetchNui, useNuiQuery } from '../../utils/nui'
import { useExitListener } from '../../utils/exitListener'

let row:any = [];
const vehicleSpawn = () => {
    const { closePage } = usePageContext()
    const [vehicle, setVehicle] = React.useState('');
    const [refresh, setRefresh] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [vehicleNames, setVehicleNames] = React.useState([]);
    const [dates, setDates] = React.useState([]);
  
    // const [vehiclePair, setVehiclePair] = React.useState(Map);
    useEffect( () => {
      function handleMessage(event: { data: any }) {
        const data = event.data
        
        if(data.action == 'dataRetrieved'){
          if(!data.data){
            setVisible(false)
          }
          else{
            setVisible(true)
            fetchNui('getDemoData', data.data.vehicleNames.length);
            setHistory(data.data.vehicleNames, data.data.dateSpawned)
          }
        }
        if(data.action == 'errorMessage'){
          setError(data.data.error);
        }
        if(data.action == 'close'){
          close();
        }
      }
    
      window.addEventListener('message', handleMessage)
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }, [])
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVehicle(e.target.value);
    }
    async function close() {
      closePage('vehicleSpawn')
      await fetchNui('closeMenu')
    }
    const handleSubmit = () => {
        sendDataToFiveM(vehicle)
    }
    const sendDataToFiveM = (model: any) => {
        const data = {model}
        if(!model){
          setError(true) 
        }
        else{
          fetchNui('spawnCar', data)
        }
        setRefresh(!refresh);
        
    }
    useExitListener(async () => {
      await close()
    })
    function setHistory(vehicleNames: [], dateSpawned: []){
      const rows = []
      for(let i = 0; i < vehicleNames.length; i++){
        rows.push(
          <tr key={i}>
          <td>{vehicleNames[i]}</td>
          <td>{dateSpawned[i]}</td>
          </tr>)
      }
      row = rows;
    }
  
    return (
      <div className='grid align-items h-screen place-content-center p-10 text-white'>
        <div className='bg-slate-700 p-12'>
          <div>
            <input type='text' placeholder='Enter a vehicle name' value={vehicle} onChange={handleInput} className='text-black'></input>
            <button onClick={handleSubmit} className='p-3'>Submit</button>
            {error && (<div>{error}</div>)}
          </div>
          {visible && (
            <div>
            History
            <div className='vehicleSpawned'>
                <table>
                  <thead>
                    <th>Vehicle Spawned</th>
                    <th>Time Stamp</th>
                  </thead>
                  <tbody>
                    {row}               
                  </tbody>
                </table>
            </div>
          </div>
          )}
          
        </div>
      </div>
    )
}

export default vehicleSpawn
