import { ClientUtils, RegisterNuiCB } from '@project-error/pe-utils'


const rpc = new ClientUtils()

const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

RegisterNuiCB("spawnCar",async (data, cb) => {
	const model = data.model;
  console.log('spawning car', model);
  
	const modelHash = GetHashKey(model)
	RequestModel(modelHash)
  if(IsModelValid(modelHash) && IsModelAVehicle(modelHash)){
    while (!HasModelLoaded(modelHash)) {
      await Delay(500)
    }
    const [x,y,z] = GetEntityCoords(PlayerPedId(), true)
	  const h = GetEntityHeading(PlayerPedId())
	  const veh = CreateVehicle(modelHash,x,y,z,h, true, true)

	  while (!DoesEntityExist(veh)) await Delay(100)

	  SetPedIntoVehicle(PlayerPedId(), veh, -1)
    SetEntityAsNoLongerNeeded(veh);
    SetEntityAsNoLongerNeeded(modelHash);

    emitNet('addVehicle', model);
    SendNUIMessage({
      action: 'close'
    })
  }
	else{
    SendNUIMessage({
      action: 'errorMessage',
      data: {
        error: 'Vehicle does not exist',
      },
    })
    
  }

});

RegisterCommand(
  'page',
  () => {
    SendNUIMessage({
      action: 'openPage',
      data: {
        pageName: 'vehicleSpawn',
      },
    })
  
    SetNuiFocus(true, true)
    emitNet("getHistory");
  },
  false,
)

RegisterNuiCB('closeMenu', (_, cb) => {
  SetNuiFocus(false, false)
  SendNUIMessage({
    action: 'closePage',
    data: {
      pageName: 'vehicleSpawn',
    },
  })

  cb(true)
})

RegisterNuiCB('getDemoData', (data, cb) => {
  emitNet('debug', data);
  cb({ demo: true, inBrowser: false })
})

onNet('historyRetrieved', (vehicleNames: [], dateSpawned: []) => {
  SendNUIMessage({
    action: 'dataRetrieved',
    data: {
      vehicleNames: vehicleNames,
      dateSpawned: dateSpawned,
    },
  })
})

