import { message } from 'antd'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { useCallback } from 'react'
import { erc20ABI, useAccount, useBalance, useNetwork } from 'wagmi'
import { fetchFeeData, readContract, waitForTransaction, writeContract } from 'wagmi/actions'

import { getGREEN, GREENAbi } from '@/contracts/GREEN'
import { getUsdtAddress, usdtAbi } from '@/contracts/usdt'

export interface UseLotteryParams {
  value: string
  setIsPending: (value: boolean) => void
  setBtnText: (value: string) => void
}

const useJoin = ({ value, setIsPending, setBtnText }: UseLotteryParams) => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id
  const bigNumber = BN.from(new BigNumber(value).times(10 ** 6).toString())
  const tokenAddress = getGREEN(chain?.id)
  const usdtAddress = getUsdtAddress(chain?.id)

  const { refetch } = useBalance({
    address,
    token: tokenAddress,
    watch: true,
  })

  return useCallback(async () => {
    let txHash = new Date().toISOString()

    const stakeFnc = async () => {
      if (!chainId || !address) {
        return
      }
      setIsPending(true)
      setBtnText('Processing...')
      const { gasPrice } = await fetchFeeData()
      const gasSupportEIP1559 = { gasPrice }

      const allowance = await readContract({
        address: usdtAddress,
        abi: usdtAbi,
        functionName: 'allowance',
        args: [address, tokenAddress],
        // @ts-ignore
        overrides: gasSupportEIP1559,
      })

      if (new BigNumber(allowance.toString()).lt(bigNumber.toString())) {
        const approve = await writeContract({
          address: usdtAddress,
          abi: usdtAbi,
          functionName: 'approve',
          args: [tokenAddress, bigNumber.toBigInt()],
          // @ts-ignore
          overrides: gasSupportEIP1559,
        })
        const receipt = await waitForTransaction({ hash: approve.hash })
      }
      const tx = await writeContract({
        address: tokenAddress,
        abi: GREENAbi,
        functionName: 'receiveUSDTAndSendGREEN',
        // @ts-ignore
        overrides: gasSupportEIP1559,
        args: [bigNumber.toBigInt()],
      })

      await waitForTransaction({
        hash: tx.hash,
      })

      await refetch()
    }

    async function stakeWithRetries() {
      try {
        await stakeFnc()
        setIsPending(false)
        setBtnText('Buy')
        message.success('Purchase successful')

        return
      } catch (e: any) {
        setIsPending(false)
        setBtnText('Buy')
        message.error('Purchase failed')
        console.log('err:', e)
      }
    }

    stakeWithRetries()
  }, [chainId, address, setIsPending, setBtnText, usdtAddress, tokenAddress, bigNumber, refetch])
}

export default useJoin
