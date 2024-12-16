import { ClientUtils, RegisterNuiCB } from '@project-error/pe-utils'

const rpc = new ClientUtils()

const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

RegisterNuiCB("spawnCar",async (data, cb) => {
	const model = data.model;
  if (!data.model) 
    return cb('No model Provided');
  if(!model)
    return console.error('No model Provided');
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
  console.log(data)

  cb({ demo: true, inBrowser: false })
})



