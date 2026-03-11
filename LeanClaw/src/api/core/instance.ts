import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import { handleBeforeRequest, handleOnSuccess, handleOnError } from './handlers'

export const alovaInstance = createAlova({
  baseURL: 'https://api.openclaw.example.com',
  statesHook: AdapterUniapp.statesHook,
  requestAdapter: AdapterUniapp.requestAdapter(),
  beforeRequest: handleBeforeRequest,
  responded: {
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  },
})
