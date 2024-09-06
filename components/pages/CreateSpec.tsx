"use client"

import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClientSpecs {
  userAgent: string
  cpuCores: number | string
  ram: string
  language: string
  platform: string
  screenResolution: string
  colorDepth: number
  pixelRatio: number
  gpuInfo: string
  osInfo: string
  browserName: string
  browserVersion: string
  cookiesEnabled: boolean
  doNotTrack: string | null
  online: boolean
  touchPoints: number
  networkType: string
  networkSpeed: string
  batteryStatus: string
}

interface ServerSpecs {
  cpu: string
  ram: string
  os: string
}

export const CreateSpec = () => {
  const [clientSpecs, setClientSpecs] = useState<ClientSpecs>({
    userAgent: "",
    cpuCores: 0,
    ram: "Unknown",
    language: "",
    platform: "",
    screenResolution: "",
    colorDepth: 0,
    pixelRatio: 1,
    gpuInfo: "Unknown",
    osInfo: "Unknown",
    browserName: "Unknown",
    browserVersion: "Unknown",
    cookiesEnabled: false,
    doNotTrack: null,
    online: false,
    touchPoints: 0,
    networkType: "Unknown",
    networkSpeed: "Unknown",
    batteryStatus: "Unknown",
  })

  const [serverSpecs, setServerSpecs] = useState<ServerSpecs>({
    cpu: "Unknown",
    ram: "Unknown",
    os: "Unknown",
  })

  // ... (기존의 getGPUInfo, getOSInfo, getBrowserInfo, getNetworkInfo, getBatteryStatus, getServerInfo 함수들)

  const scanSpecs = async () => {
    const networkInfo = getNetworkInfo()
    const browserInfo = getBrowserInfo()
    const batteryStatus = await getBatteryStatus()

    // Client specs
    setClientSpecs({
      userAgent: navigator.userAgent,
      cpuCores: navigator.hardwareConcurrency || "Unknown",
      ram:
        "deviceMemory" in navigator
          ? `${(navigator as any).deviceMemory} GB`
          : "Unknown",
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      gpuInfo: getGPUInfo(),
      osInfo: getOSInfo(),
      browserName: browserInfo.browserName,
      browserVersion: browserInfo.version,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      online: navigator.onLine,
      touchPoints: navigator.maxTouchPoints,
      networkType: networkInfo.type,
      networkSpeed: networkInfo.speed,
      batteryStatus: batteryStatus,
    })

    // Server specs
    const serverInfo = await getServerInfo()
    if (serverInfo) {
      setServerSpecs({
        cpu: `${serverInfo.cpu.brand} (${serverInfo.cpu.cores} cores)`,
        ram: `${Math.round(serverInfo.memory.total / (1024 * 1024 * 1024))} GB`,
        os: `${serverInfo.os.distro} ${serverInfo.os.release}`,
      })
    }
  }

  useEffect(() => {
    scanSpecs()
  }, [])

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return "N/A"
    }
    if (typeof value === "boolean") {
      return value.toString()
    }
    return value
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced PC Spec Scanner</h1>
      <Button onClick={scanSpecs} className="mb-4">
        Rescan Specs
      </Button>
      <h2 className="text-xl font-bold mb-2">Client (Browser) Information:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {Object.entries(clientSpecs).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{renderValue(value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Server Information:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(serverSpecs).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{renderValue(value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CreateSpec
