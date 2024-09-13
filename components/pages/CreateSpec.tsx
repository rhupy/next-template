"use client"

import React, { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ClientSpecs {
  cpuCores: string
  ram: string
  language: string
  platform: string
  screenDisply: string
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
  return match ? match[0] : "Internal GPU"
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
    cpuCores: "12 Thread",
    ram: "",
    language: navigator.language,
    platform: navigator.platform,
    screenDisply: getScreenInfo(),
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    gpuInfo: getGPUInfo(),
    browser: `${getBrowserInfo().browserName} ${getBrowserInfo().version}`,
    operatingSystem: getOSInfo(),
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    online: navigator.onLine,
    touchPoints: navigator.maxTouchPoints,
    networkType: getNetworkInfo().type,
    networkSpeed: getNetworkInfo().speed,
    batteryStatus: "Unknown",
  })

  const [editableSpecs, setEditableSpecs] = useState({
    cpuCores: "12 Thread",
    ram: "",
    screenDisply: getScreenInfo(),
    operatingSystem: getOSInfo(),
    gpu: "",
  })

  const [additionalInputs, setAdditionalInputs] = useState({
    cpuAdditional: "",
    DisplyAdditional: "",
    gpuAdditional: "",
    osAdditional: "",
  })

  const handleEditableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableSpecs({
      ...editableSpecs,
      [e.target.name]: e.target.value,
    })
  }

  const handleAdditionalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdditionalInputs({
      ...additionalInputs,
      [e.target.name]: e.target.value,
    })
  }

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
    <div className="container mx-auto h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">K - PC 스팩 시트 생성기</h1>
      <div className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Spec</TableHead>
              <TableHead className="">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">CPU</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input
                    name="cpuAdditional"
                    value={additionalInputs.cpuAdditional}
                    onChange={handleAdditionalInputChange}
                    className="grow"
                    placeholder="CPU 정보 입력"
                  />
                  <span className="min-w-[100px]">
                    {editableSpecs.cpuCores}
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Memory</TableCell>
              <TableCell>
                <Input
                  name="ram"
                  value={editableSpecs.ram}
                  onChange={handleEditableChange}
                  className="w-full"
                  placeholder="메모리 정보 입력"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Disply</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input
                    name="DisplyAdditional"
                    value={additionalInputs.DisplyAdditional}
                    onChange={handleAdditionalInputChange}
                    className="grow"
                    placeholder="디스플레이 정보 입력"
                  />
                  <span className="min-w-[100px]">
                    {editableSpecs.screenDisply}
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">GPU</TableCell>
              <div className="flex items-center space-x-2">
                <Input
                  name="GpuAdditional"
                  value={additionalInputs.gpuAdditional}
                  onChange={handleAdditionalInputChange}
                  className="grow"
                  placeholder="디스플레이 정보 입력"
                />
                <span className="min-w-[100px]">
                  <TableCell>{clientSpecs.gpuInfo}</TableCell>
                </span>
              </div>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Browser</TableCell>
              <TableCell>{clientSpecs.browser}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">OS</TableCell>
              <TableCell>
                <Input
                  name="operatingSystem"
                  value={editableSpecs.operatingSystem}
                  onChange={handleEditableChange}
                  className="w-full"
                  placeholder="운영체제 정보 입력"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h2 className="mb-2 text-xl font-bold">Additional Information:</h2>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(clientSpecs).map(([key, value]) => {
          if (
            ![
              "cpuCores",
              "ram",
              "screenDisply",
              "gpuInfo",
              "browser",
              "operatingSystem",
            ].includes(key)
          ) {
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{renderValue(value)}</p>
                </CardContent>
              </Card>
            )
          }
          return null
        })}
      </div>
      <div className="fixed-bottom-right">
        <Badge>PLTR갤러리</Badge>
      </div>
    </div>
  )
}

export default CreateSpec
