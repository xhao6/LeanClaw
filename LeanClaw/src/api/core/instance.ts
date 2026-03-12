import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import { handleBeforeRequest, handleOnSuccess, handleOnError } from './handlers'

const adapter = AdapterUniapp()

export const alovaInstance = createAlova({
  baseURL: 'https://api.openclaw.example.com',
  statesHook: adapter.statesHook,
  requestAdapter: adapter.requestAdapter,
  beforeRequest: handleBeforeRequest,
  responded: {
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  },
})
