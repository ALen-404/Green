import { shorten } from '@did-network/dapp-sdk'
import { Button, Dropdown, Layout, MenuProps } from 'antd'
import { useAccount } from 'wagmi'

import arrow from '../../assets/image/swap/arrow.svg'
import { ToastActionElement } from '../ui/toast'
import { WalletModal } from '../WalletModal'

import './index.less'

export const LayoutElement = ({ children }: { children: ToastActionElement | undefined }) => {
  const [collapsed, setCollapsed] = useState(true)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const { address } = useAccount()
  const { Content } = Layout

  const [show, setShow] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(70deg, rgb(66,137,43),  rgb(152,605,63))' }}>
      <Layout className="bg-white">
        <div className="header h-16  border-white box-border">
          <div className="h-16  border-white box-border">
            <div className="max-w-6xl m-auto h-full flex justify-between items-center sm:px-8 lt-sm:px-4">
              <div className="flex items-center font-bold cursor-pointer">
                <img src={arrow} />
              </div>
              <div className="flex items-center gap-2 bg-white networkBox">
                <WalletModal open={show} onOpenChange={toggleModal} close={() => setShow(false)}>
                  {({ isLoading }) => (
                    <Button className="flex items-center ">
                      {isLoading && (
                        <span className="i-line-md:loading-twotone-loop inline-flex mr-1 w-4 h-4 text-white"></span>
                      )}{' '}
                      {address ? shorten(address) : 'Connect Wallet'}
                    </Button>
                  )}
                </WalletModal>
              </div>
            </div>
          </div>
        </div>
        <Content className="bg-white">{children}</Content>
      </Layout>
    </Layout>
  )
}
