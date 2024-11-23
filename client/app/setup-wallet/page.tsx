'use client'

import { useAppKitAccount } from "@reown/appkit/react"
import { useEffect, useRef } from "react"
import axios from 'axios'
import { type User, useSignal, initData } from '@telegram-apps/sdk-react';

const makeReq = async (data: { address: string, tgData: any }) => {
    try {
        // update user data (username, first name, lest name)
        // await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/setup-wallet`, { id: data.tgData.user?.id, walletAddress: data.address })

        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/setup-wallet`, { id: data.tgData.user?.id, walletAddress: data.address })

    } catch (err) {
        console.log(err)
    }
}

export default function SetupWalletPage() {
    const isReqSend = useRef(false)
    const { isConnected, address } = useAppKitAccount()
    const initDataState = useSignal(initData.state);


    useEffect(() => {
        console.log(isConnected, address, initDataState)
        if (!isConnected || !address) return
        if (!initDataState) {
            return;
        }

        if (isReqSend.current) return;
        isReqSend.current = true

        makeReq({ address, tgData: initDataState })
        initDataState.user?.id

    }, [isConnected])

    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center">
            <p>Click connect button to connect wallet. Then your app would be closed</p>
            <appkit-button />
        </div>
    )
}