'use client'

import { z } from "zod"

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

export default function SignMessage() {


    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center">
            <p>Click connect button to connect wallet, fill form with data and submit it.</p>
            <appkit-button />
        </div>
    )
}