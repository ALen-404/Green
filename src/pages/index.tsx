import { shorten } from '@did-network/dapp-sdk'
import { Button, Input, message, Pagination, Progress, Table } from 'antd'
import BigNumber from 'bignumber.js'
import { mainnet, useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { LayoutElement } from '@/components/layout'
import { WalletModal } from '@/components/WalletModal'
import { getGREEN, GREENAbi } from '@/contracts/GREEN'
import { getUsdtAddress, usdtAbi } from '@/contracts/usdt'
import { copyMsg, getCoinDisplay } from '@/utils/formatter'
import useJoin from '@/utils/use-swap'

import changeIcon from '../assets/image/swap/changeIcon.svg'
import Green from '../assets/image/swap/Green.jpg'
import usdt from '../assets/image/swap/usdt.svg'

import './index.less'

const Home = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [swapCakeAmount, setSwapCakeAmount] = useState('0')
  const [swapGREENCOINAmount, setSwapGREENCOINAmount] = useState('0')
  const [rate, setRate] = useState('0')
  const [totalGreenIAmountToUsdt, setTotalGreenIAmountToUsdt] = useState('0')
  const [totalSupplyUsdt, setTotalSupplyUsdt] = useState('0')
  const [btnText, setBtnText] = useState('Buy')
  const [approveNum, setApproveNum] = useState('Buy')

  const [isPending, setIsPending] = useState(true)
  const [errText, setErrText] = useState('')

  const totalGreenIAmount = useContractRead({
    address: getGREEN(mainnet.id),
    abi: GREENAbi,
    functionName: 'totalGREENIssued',
    watch: true,
    chainId: mainnet.id,
  })
  console.log(totalGreenIAmount)

  const totalSupply = useContractRead({
    address: getGREEN(mainnet?.id),
    abi: GREENAbi,
    functionName: 'totalSupply',
    chainId: mainnet.id,
    watch: true,
  })
  const usdtBalance = useBalance({
    address: address,
    token: getUsdtAddress(chain?.id),
    chainId: mainnet.id,
    watch: true,
  })

  const allowance = useContractRead({
    address: getUsdtAddress(chain?.id),
    abi: usdtAbi,
    functionName: 'allowance',
    chainId: mainnet.id,
    watch: true,
    args: [address!, getGREEN(chain?.id)],
  })

  useEffect(() => {
    const initAllowance = new BigNumber(allowance.data?.toString() || 0).div(10 ** 6).toString()
    setApproveNum(initAllowance)
    console.log(initAllowance)
  }, [allowance.data])

  useEffect(() => {
    const rate = new BigNumber(totalGreenIAmount?.data?.toString() || '0')
      .div(totalSupply?.data?.toString() || '1')
      .multipliedBy(100)
      .toFixed(2)
    setRate(rate)
    const initTotalGreenIAmountToUsdt = new BigNumber(totalGreenIAmount?.data?.toString() || '0')
      .div(10 ** 18)
      .div(1000)
      .toString()
    const initTotalSupply = new BigNumber(totalSupply?.data?.toString() || '0')
      .div(10 ** 18)
      .div(1000)
      .toString()
    setTotalGreenIAmountToUsdt(initTotalGreenIAmountToUsdt)
    setTotalSupplyUsdt(initTotalSupply)
  }, [totalGreenIAmount.data, totalSupply.data])

  const onSwap = useJoin({ value: swapCakeAmount || '0', setIsPending, setBtnText })

  const handleCakeChange = (e: any) => {
    if (!Number(e.target.value)) {
      setSwapCakeAmount('')
      setSwapGREENCOINAmount('')
      setIsPending(true)
      return
    }

    if (new BigNumber(approveNum).gte(e.target.value) || Number(approveNum) === 0) {
      if (new BigNumber(usdtBalance.data?.formatted || 0).gte(e.target.value)) {
        setIsPending(false)
        setErrText('')
      } else {
        setIsPending(true)
        setErrText('You dont have enough USDT to continue')
      }
    } else {
      setIsPending(true)
      setErrText("You can't buy more than approved. Please use up the approved amount")
    }

    setSwapCakeAmount(e.target.value)
    setSwapGREENCOINAmount(new BigNumber(e.target.value).multipliedBy(1000).toString())
  }

  const [show, setShow] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
  }

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">{/* <img src={background} alt="background" /> */}</div>

        <div className="swapCard">
          <p className="swapTitle">Green Green Coin - 100% Supply For Sale</p>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input
                disabled={!isConnected}
                className="inputBtn"
                value={swapCakeAmount}
                onChange={handleCakeChange}
              ></Input>
            </div>
            <div className="inputBoxRight">
              <img src={usdt} alt="" />
              <p>USDT</p>
            </div>
          </div>
          <div className="approveBox">
            <p>approved:</p>
            <span>{approveNum}</span>
          </div>
          <div className="inputIcon">
            <img src={changeIcon} alt="changeIcon" />
          </div>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input disabled className="inputBtn" value={swapGREENCOINAmount}></Input>
            </div>
            <div className="inputBoxRight">
              <img src={Green} alt="" />
              <p>Green</p>
            </div>
          </div>
          <div className="idoBox">
            <Progress
              percent={Number(rate)}
              status="active"
              showInfo={false}
              strokeColor={{ from: 'rgb(66, 137, 43)', to: 'rgb(152, 605, 63)' }}
            />
            <div className="idoTitle">
              <p>
                USDT Raised: ${getCoinDisplay(totalGreenIAmountToUsdt)} / ${getCoinDisplay(totalSupplyUsdt)}
              </p>
              <span>{rate}%</span>
            </div>
          </div>
          <div className="rate">
            <p>1 USDT = 1000 Green</p>
          </div>
          <div className="rate addressBox">
            <p>
              Coin Address:{getGREEN(chain?.id).slice(0, 4)}...
              {getGREEN(chain?.id).slice(getGREEN(chain?.id).length - 5, getGREEN(chain?.id).length)}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  copyMsg(getGREEN(chain?.id), 'copy success')
                }}
              >
                <rect opacity="0.1" width="24" height="24" rx="12" transform="matrix(1 0 0 -1 0 24)" fill="white" />
                <g opacity="0.6">
                  <path
                    d="M17.7001 14.7286H11.5715C10.8286 14.7286 10.2715 14.1714 10.2715 13.4286V7.3C10.2715 6.55714 10.8286 6 11.5715 6H17.7001C18.4429 6 19.0001 6.55714 19.0001 7.3V13.4286C19.0001 14.0786 18.4429 14.7286 17.7001 14.7286Z"
                    stroke="white"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.6357 16.4929V17.3286C14.6357 18.0714 14.0786 18.6286 13.3357 18.6286H7.3C6.55714 18.6286 6 18.0714 6 17.3286V11.2C6 10.4571 6.55714 9.89999 7.3 9.89999H8.41429"
                    stroke="white"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </svg>
            </p>
          </div>
          <div className="errText">
            <p>{errText}</p>
          </div>
          {isConnected ? (
            <button
              disabled={isPending || !Number(swapCakeAmount)}
              className={isPending || !Number(swapCakeAmount) ? 'normalBtn disable' : 'normalBtn'}
              onClick={onSwap}
            >
              {btnText}
            </button>
          ) : (
            <WalletModal open={show} onOpenChange={toggleModal} close={() => setShow(false)}>
              {({ isLoading }) => (
                <Button className="flex items-center  justify-center normalBtn ">
                  {isLoading && (
                    <span className="i-line-md:loading-twotone-loop text-center inline-flex mr-1 w-4 h-4 text-white"></span>
                  )}{' '}
                  {address ? shorten(address) : 'Connect Wallet'}
                </Button>
              )}
            </WalletModal>
          )}
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
