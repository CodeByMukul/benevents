"use client"
import { useState } from "react"
import { Scanner, useDevices, outline, boundingBox, centerText, } from "@yudiel/react-qr-scanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { decryptJson } from "@/lib/utils"
import axios from "axios"
export default function ScannerPage({eventId,secretKey}:{eventId:string,secretKey:string}) {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  const [tracker, setTracker] = useState<string>("outline")
  const [isScanning, setIsScanning] = useState(false) // Scanner visibility
  const [scanMessage, setScanMessage] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null) // Avoid duplicate scans
  const [buyerName, setBuyerName] = useState<string | null>(null)
  const devices = useDevices()

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline
      case "boundingBox":
        return boundingBox
      case "centerText":
        return centerText
      default:
        return undefined
    }
  }

  const handleScan = async (data: string) => {
    if (!data || data === lastScanned) return // Avoid duplicate scans
    try {
      const decryptedData = decryptJson(data,secretKey)
      if(eventId)if (decryptedData.eventId!=eventId){ setScanMessage("❌ Invalid Ticket");setBuyerName(null);return;} //put eventId there as if it is admin then he will pass empty eventId and hence verifying if it is admin or not
      setScanMessage("🔄 Verifying ticket...") // Show loading state
      setLastScanned(data) // Store last scanned value

      // Fetch verification API
      const response= await axios.post("/api/verify-ticket", decryptedData)
      const result = response.data

      if (response && result.success) {
        setScanMessage("✅ Success! Ticket is valid.")
        setBuyerName(result.ticket.buyer?.firstName+" "+result.ticket.buyer?.lastName|| "Unknown")
      } else {
        setScanMessage(`❌ ${result.message || "Invalid ticket."}`)
        setBuyerName(null)
      }
    } catch (error) {
      console.error("Scan error:", error)
      setScanMessage("❌ Error processing QR code.")
      setBuyerName(null)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    setScanMessage(null) // Clear message when stopping scanning
    setLastScanned(null) // Reset last scanned QR
    setBuyerName(null)
  }

  return (
    <div className="bg-dotted-pattern h-full">
      <Card className="w-full max-w-md mx-auto  p-4 bg-primary-50">
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Scan a QR code to verify ticket</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4">
        {/* Start Scanning Button */}
        {!isScanning ? (
          <Button className="w-full" onClick={() => setIsScanning(true)}>
            Start Scanning
          </Button>
        ) : (
          <>
            {/* Device & Tracker Selection 
            <div className="flex w-full space-x-2">
              <select
                className="w-1/2 p-2 border rounded-md"
                onChange={(e) => setDeviceId(e.target.value)}
              >
                <option value={undefined}>Select Device</option>
                {devices.map((device, index) => (
                  <option key={index} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>

              <select
                className="w-1/2 p-2 border rounded-md"
                onChange={(e) => setTracker(e.target.value)}
              >
                <option value="centerText">Center Text</option>
                <option value="outline">Outline</option>
                <option value="boundingBox">Bounding Box</option>
                <option value={undefined}>No Tracker</option>
              </select>
            </div>
*/}
            {/* QR Scanner */}
            <div className="w-full flex justify-center">
              {isScanning && (
                <Scanner
                  formats={["qr_code"]}
                  constraints={{ deviceId: deviceId }}
                  onScan={(detectedCodes) => {
                    if (detectedCodes.length > 0) {
                      handleScan(detectedCodes[0].rawValue)
                    }
                  }}
                  onError={(error) => console.error(`Scan Error: ${error}`)}
                  styles={{ container: { height: "400px", width: "350px" } }}
                  allowMultiple={false} // Ensure only one scan happens at a time
                  scanDelay={2000} // Reduce rapid-fire scanning
                  components={{ tracker: getTracker() }}
                />
              )}
            </div>

            {/* Scan Result */}
            {scanMessage && (
              <div
                className={`p-3 rounded-md text-center ${
                  scanMessage.startsWith("✅")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {scanMessage}
{buyerName && (
                    <div className="mt-2 font-semibold">
                      Buyer: {buyerName}
                    </div>
                  )}
              </div>
            )}

            {/* Stop Scanning Button */}
            <Button className="w-full" onClick={stopScanning}>
              Stop Scanning
            </Button>
          </>
        )}
      </CardContent>
    </Card>
</div>

  )
}

