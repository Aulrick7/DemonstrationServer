import React, { useState, useEffect } from 'react'
import { usePageContext } from '../../App'
import { fetchNui, useNuiQuery } from '../../utils/nui'
import { useExitListener } from '../../utils/exitListener'
import { ifError } from 'assert';

const vehicleSpawn = () => {
    const { closePage } = usePageContext()
    const [vehicle, setVehicle] = React.useState('');
    const [refresh, setRefresh] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    // const app = express();
    // app.use(cors());
    
    // const db = mysql.createConnection({
    //     host: '127.0.0.1',
    //     user: 'root',
    //     password: '',
    //     database: 'vehicles'
    // })
    // app.get('/vehicleSpawned', (req: any, res: { json: (arg0: any) => any; }) => {
    //     const sql = "SELECT * FROM vehicleSpawned";
    //     db.query(sql, (err: any, data: any) => {
    //         if(err) return res.json(err)
    //         return res.json(data); 
    //     })
    // })
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
        addVehicle(vehicle)
        close();
    }
    const sendDataToFiveM = (model: any) => {
        const data = {model}
        fetchNui('spawnCar', data)
        setRefresh(!refresh);
    }
    useExitListener(async () => {
      await close()
    })
    
    function addVehicle(model:String){
      const ox = global.exports('oxmysql');
      ox.execute('INSERT INTO vehicleSpawned (vehicleSpawned, dateSpawned) VALUES (?, CURRENT_TIMESTAMP)', model)
    }
  
    return (
      <div className='grid align-items h-screen place-content-center p-10 text-white'>
        <div className='bg-slate-700 p-12'>
          <div>
            <input type='text' placeholder='Enter a vehicle name' value={vehicle} onChange={handleInput} className='text-black'></input>
            <button onClick={handleSubmit} className='p-3'>Submit</button>
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
                  {/* <tbody>
                    {data.map((d, i) => (
                      <tr key={i}>
                        <td>{d.vehicleSpawned}</td>
                        <td>{d.timeStamp}</td>
                      </tr>
                    ))}
                  </tbody> */}
                </table>
            </div>
          </div>
          )}
          
        </div>
      </div>
    )
}

export default vehicleSpawn
