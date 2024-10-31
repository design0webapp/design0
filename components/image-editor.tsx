'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ImageEditorComponent() {
  const [imageUrl, setImageUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [taskId, setTaskId] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0)
        }
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setSelection({ x, y, width: 0, height: 0 })
      setIsSelecting(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setSelection(prev => ({
        ...prev,
        width: x - prev.x,
        height: y - prev.y
      }))
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const handleSubmit = async () => {
    // Create a mask image
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = canvasRef.current!.width
    maskCanvas.height = canvasRef.current!.height
    const maskCtx = maskCanvas.getContext('2d')
    maskCtx!.fillStyle = 'black'
    maskCtx!.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx!.fillStyle = 'white'
    maskCtx!.fillRect(selection.x, selection.y, selection.width, selection.height)

    // Convert mask to base64
    const maskBase64 = maskCanvas.toDataURL('image/png')

    // Submit to backend
    const response = await fetch('/api/edit-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, maskBase64, prompt })
    })
    const data = await response.json()
    setTaskId(data.taskId)

    // Start polling for task status
    const intervalId = setInterval(async () => {
      const statusResponse = await fetch(`/api/task-status?taskId=${data.taskId}`)
      const statusData = await statusResponse.json()
      setTaskStatus(statusData.status)
      if (statusData.status === 'completed') {
        clearInterval(intervalId)
        setImageUrl(statusData.resultImageUrl)
      }
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full max-w-md"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300"
      />
      <Textarea
        placeholder="Enter prompt for editing"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-md"
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {taskId && <p>Task ID: {taskId}</p>}
      {taskStatus && <p>Task Status: {taskStatus}</p>}
    </div>
  )
}