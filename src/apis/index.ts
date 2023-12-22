import { get, post } from '@/utils/request'

export const loginDapp = (loginReq: any) => {
  return post('/user/login', { ...loginReq })
}
export const getBind = (userAddr: string) => {
  return get(`/user/getBind?userAddr=${userAddr}`)
}
export const getPond = () => {
  return get(`/trade/getPond`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getPledgeRankList = (page: any, pageSize: any) => {
  return get(`/rankList/getPledgeRankList?page=${page}&pageSize=${pageSize}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const withdrawal = (amount: any, userAddr: any) => {
  return post(
    `/trade/withdrawal`,
    { amount, userAddr },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const getUser = () => {
  return get(`/user/getUser`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getSwap = () => {
  return get(`/trade/getSwap?page=1&pageSize=10`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getBaoPledge = () => {
  return get(`/trade/getBaoPledge?page=1&pageSize=10`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getQuotes = () => {
  return get(`/trade/getQuotes`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const baoTransfer = (amount: any, type: any, userAddr: any) => {
  return post(
    `/trade/baoTransfer`,
    { amount, type, userAddr },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}

export const getBaoPldgeConfig = () => {
  return get(`/trade/getBaoPldgeConfig`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const baoPledge = (bpId: any, isReinvest: any, pledgeCake: any) => {
  return post(
    `/trade/baoPledge`,
    { bpId, isReinvest, pledgeCake },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const startReinvestment = (isReinvest: any, orderNo: any) => {
  return post(
    `/trade/startReinvestment`,
    { isReinvest, orderNo },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}

export const getPledge = () => {
  return get(`/trade/getPledge?page=1&pageSize=10`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getUserSon = (page: any, pageSize: any) => {
  return get(`/user/getUserSon?page=${page}&pageSize=${pageSize}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getPledgeRankListV2 = (page: any, pageSize: any) => {
  return get(`/rankList/getPledgeRankListV2?page=${page}&pageSize=${pageSize}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const loginOut = () => {
  return post(
    `/user/loginOut`,
    {},
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const getIsToken = (userAddr: any) => {
  return get(`/user/isToken?userAddr=${userAddr}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
