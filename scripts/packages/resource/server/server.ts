import { ServerPromiseResp, ServerUtils } from '@project-error/pe-utils'
import { timeStamp } from 'console'

const rpc = new ServerUtils()
const ox = global.exports['oxmysql']
rpc.onNetPromise('test', (req, resp) => {
  const player = req.source

  const respObj: ServerPromiseResp<any> = {
    status: 'ok',
    data: {
      helloFrom: 'server',
      player,
    },
  }
  resp(respObj)
})

onNet('addVehicle', (model:String) => {
  console.log(`${model}`);
  const player = global.source;
  const ID = getPlayerIdentifiers(player);
  const discordid = ID[1];
  ox.execute('SELECT * FROM users WHERE discord = ?', [discordid], (result:any) => {
    if(result.length != 0){
        const date = new Date;
        const formatDate = date.toLocaleString();
        ox.execute('INSERT INTO `?` (vehicleSpawned, dateSpawned) VALUES (?, ?)', [discordid, model, formatDate], (result:any) => {
        console.log(result.length)
        if(result.length != 0){
          console.log("vehicle added");
        }
      })
    }
    else{
      ox.execute('INSERT INTO users (discord) VALUES (?)', [discordid], (result:any) => {
        if(result.length != 0){
          console.log("user added");
          ox.execute('CREATE TABLE IF NOT EXISTS `?` (id INT NOT NULL AUTO_INCREMENT,vehicleSpawned VARCHAR(255) NULL DEFAULT NULL,dateSpawned VARCHAR(255) NULL DEFAULT NULL, PRIMARY KEY (id))', [discord], (result:any) => {
            if(result.length != 0){
              console.log("table added");
              const date = new Date;
              const formatDate = date.toLocaleString();
              ox.execute('INSERT INTO `?` (vehicleSpawned, dateSpawned) VALUES (?, ?)', [discordid, model, formatDate], (result:any) => {
                if(result.length != 0){
                  console.log("vehicle added");
                }
              })
            }
          });
        }
      })
      const discord = discordid;
      console.log(`${discord}`);
      
      
    }
  })
  
  
})

onNet('getHistory', ()=> {
  const player = global.source;
  const ID = getPlayerIdentifiers(player);
  const discordid = ID[1];
  ox.execute('CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT,discord VARCHAR(255) NOT NULL DEFAULT 0,PRIMARY KEY (id))') 
  ox.execute('SELECT * FROM `?`', [discordid], (result:any) => {
    if(result.length > 0){
      const vehicleNames = []
      const dateSpawned = [Date]
      for(let i = 0; i < result.length; i++){
        vehicleNames[i] = result[i].vehicleSpawned;
        dateSpawned[i] = result[i].dateSpawned;
      }
      emitNet('historyRetrieved', player, vehicleNames, dateSpawned)
    }
  
  })
    
})
  
    
  

  


onNet('debug', (data:any) => {
  console.log(data);
})