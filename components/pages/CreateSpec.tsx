"use client"

import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClientSpecs {
  cpuCores: number | string
  ram: string
  language: string
  platform: string
  screenResolution: string
  colorDepth: number
  pixelRatio: number
  gpuInfo: string
  browser: string
  operatingSystem: string
  cookiesEnabled: boolean
  doNotTrack: string | null
  online: boolean
  touchPoints: number
  networkType: string
  networkSpeed: string
  batteryStatus: string
}

const getNetworkInfo = () => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection
  return {
    type: connection ? connection.effectiveType : "Unknown",
    speed: connection ? `${connection.downlink} Mbps` : "Unknown",
  }
}

const getBrowserInfo = (): { browserName: string; version: string } => {
  const ua = navigator.userAgent
  let browserName = "Unknown"
  let version = "Unknown"

  if (ua.indexOf("Edg/") > -1) {
    browserName = "Edge"
    version = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || "Unknown"
  } else if (ua.indexOf("Chrome/") > -1) {
    browserName = "Chrome"
    version = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || "Unknown"
  } else if (ua.indexOf("Firefox/") > -1) {
    browserName = "Firefox"
    version = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || "Unknown"
  } else if (ua.indexOf("Safari/") > -1 && ua.indexOf("Chrome") === -1) {
    browserName = "Safari"
    version = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || "Unknown"
  } else if (ua.indexOf("OPR/") > -1 || ua.indexOf("Opera/") > -1) {
    browserName = "Opera"
    version = ua.match(/(?:OPR|Opera)\/(\d+(\.\d+)?)/)?.[1] || "Unknown"
  }

  return { browserName, version }
}

const getBatteryStatus = async () => {
  if ("getBattery" in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      return `${(battery.level * 100).toFixed(2)}%, ${
        battery.charging ? "Charging" : "Not charging"
      }`
    } catch (error) {
      console.error("Error getting battery status:", error)
      return "Unknown"
    }
  }
  return "Not supported"
}

const getGPUInfo = (): string => {
  const canvas = document.createElement("canvas")
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  if (!gl) {
    return "WebGL not supported"
  }
  const debugInfo = (gl as WebGLRenderingContext).getExtension(
    "WEBGL_debug_renderer_info"
  )
  if (!debugInfo) {
    return "Unknown"
  }
  const renderer = (gl as WebGLRenderingContext).getParameter(
    debugInfo.UNMASKED_RENDERER_WEBGL
  )

  // NVIDIA GeForce RTX 4070 SUPER 추출을 위한 정규 표현식
  const match = renderer.match(/NVIDIA GeForce RTX 4070 SUPER/i)
  return match ? match[0] : "Other GPU"
}

const getOSInfo = (): string => {
  const ua = navigator.userAgent
  if (ua.indexOf("Win") > -1) return "Windows"
  if (ua.indexOf("Mac") > -1) return "macOS"
  if (ua.indexOf("Linux") > -1) return "Linux"
  if (ua.indexOf("Android") > -1) return "Android"
  if (ua.indexOf("like Mac") > -1) return "iOS"
  return "Unknown"
}

const getRAM = (): string => {
  if ("deviceMemory" in navigator) {
    const deviceMemory = (navigator as any).deviceMemory
    if (deviceMemory < 1) return "Less than 1 GB"
    if (deviceMemory >= 8) return "8 GB or more"
    return `${deviceMemory} GB`
  }
  return "Unknown"
}

const getScreenInfo = (): string => {
  const width = window.screen.width * window.devicePixelRatio
  const height = window.screen.height * window.devicePixelRatio
  const refreshRate =
    "refreshRate" in window.screen
      ? (window.screen as any).refreshRate
      : "Unknown"
  return `${Math.round(width)}x${Math.round(height)}${
    refreshRate !== "Unknown" ? ` @ ${refreshRate}Hz` : ""
  }`
}

export const CreateSpec = () => {
  const [clientSpecs, setClientSpecs] = useState<ClientSpecs>({
    cpuCores: 0,
    ram: "Unknown",
    language: "",
    platform: "",
    screenResolution: "",
    colorDepth: 0,
    pixelRatio: 1,
    gpuInfo: "Unknown",
    browser: "Unknown",
    operatingSystem: "Unknown",
    cookiesEnabled: false,
    doNotTrack: null,
    online: false,
    touchPoints: 0,
    networkType: "Unknown",
    networkSpeed: "Unknown",
    batteryStatus: "Unknown",
  })

  const scanSpecs = async () => {
    try {
      const networkInfo = getNetworkInfo()
      const browserInfo = getBrowserInfo()
      const batteryStatus = await getBatteryStatus()
      const osInfo = getOSInfo()

      setClientSpecs({
        cpuCores: navigator.hardwareConcurrency || "Unknown",
        ram: getRAM(),
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: getScreenInfo(),
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        gpuInfo: getGPUInfo(),
        browser: `${browserInfo.browserName} ${browserInfo.version}`,
        operatingSystem: osInfo,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        online: navigator.onLine,
        touchPoints: navigator.maxTouchPoints,
        networkType: networkInfo.type,
        networkSpeed: networkInfo.speed,
        batteryStatus: batteryStatus,
      })
    } catch (error) {
      console.error("Error scanning specs:", error)
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
    </div>
  )
}

export default CreateSpec
