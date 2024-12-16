import React, { useState, useEffect } from 'react'
import { usePageContext } from '../../App'
import { fetchNui, useNuiQuery } from '../../utils/nui'
import { useExitListener } from '../../utils/exitListener'

const vehicleSpawn = () => {
    const { closePage } = usePageContext()
    const [vehicle, setVehicle] = React.useState('');
    const [refresh, setRefresh] = React.useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVehicle(e.target.value);
    }
    async function close() {
      closePage('vehicleSpawn')
      await fetchNui('closeMenu')
    }
    const handleSubmit = () => {
        sendDataToFiveM(vehicle)
        setVehicle('');
    }
    const sendDataToFiveM = (model: any) => {
        const data = {model}
        fetchNui('spawnCar', data)
        setRefresh(!refresh);
    }
    useExitListener(async () => {
      await close()
    })

    return (
      <div className='grid align-items h-screen place-content-center p-10 text-white'>
        <div className='bg-slate-700 p-12'>
          <div><input type='text' placeholder='Enter a vehicle name' value={vehicle} onChange={handleInput}></input></div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    )
}

export default vehicleSpawn
