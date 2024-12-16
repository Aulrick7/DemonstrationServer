import { ClientUtils, RegisterNuiCB } from '@project-error/pe-utils'

const rpc = new ClientUtils()

async function main() {
  const res = await rpc.emitNetPromise('test', {
    hello: 'from client',
  })

  console.log(res)
}
RegisterCommand("sv",async (source:number, args: string[], rawCommand:string) => {
	const [model] = args
	const modelHash = GetHashKey(model)

	if (!IsModelAVehicle(modelHash)) return
	RequestModel(modelHash)
	while (!HasModelLoaded) await Delay(100)

	const [x,y,z] = GetEntityCoords(PlayerPedId(), true)
	const h = GetEntityHeading(PlayerPedId())
	const veh = CreateVehicle(modelHash,x,y,z,h, true, true)

	while (!DoesEntityExist(veh)) await Delay(100)

	SetPedIntoVehicle(PlayerPedId(), veh, -1)
}, false)

RegisterCommand(
  'nuitest',
  () => {
    SendNUIMessage({
      action: 'openPage',
      data: {
        pageName: 'HelloWorld',
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
      pageName: 'HelloWorld',
    },
  })

  cb(true)
})

RegisterNuiCB('getDemoData', (data, cb) => {
  console.log(data)

  cb({ demo: true, inBrowser: false })
})

main()
