import { ClientUtils, RegisterNuiCB } from '@project-error/pe-utils'


const rpc = new ClientUtils()

const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

RegisterNuiCB("spawnCar",async (data, cb) => {
	const model = data.model;
  if(!model){
    return cb(false);
  }
    
  console.log('spawning car', model);
  
	const modelHash = GetHashKey(model)

	RequestModel(modelHash)
	while (!HasModelLoaded) await Delay(500)

	const [x,y,z] = GetEntityCoords(PlayerPedId(), true)
	const h = GetEntityHeading(PlayerPedId())
	const veh = CreateVehicle(modelHash,x,y,z,h, true, true)

	while (!DoesEntityExist(veh)) await Delay(100)

	SetPedIntoVehicle(PlayerPedId(), veh, -1)
  SetEntityAsNoLongerNeeded(veh);
  SetEntityAsNoLongerNeeded(model);

  emitNet('addVehicle', model);
  return cb('true')
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

