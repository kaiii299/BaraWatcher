'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { set } from 'date-fns'

const apiOptions = [
  { name: 'Image', endpoint: '/api/image' },
  { name: 'Video', endpoint: '/api/video' },
  { name: 'Text', endpoint: '/api/text' },
]

const documentationLinks = [
  { title: 'Getting Started', description: 'Learn the basics of our API', link: '/docs/getting-started' },
  { title: 'Authentication', description: 'Secure your API requests', link: '/docs/authentication' },
  { title: 'Endpoints', description: 'Explore all available endpoints', link: '/docs/endpoints' },
]

export default function ApiTester() {
  const [selectedApi, setSelectedApi] = useState(apiOptions[0].endpoint)
  const [params, setParams] = useState('')
  const [method, setMethod] = useState('GET')
  const [response, setResponse] = useState('')
  const [quota, setQuota] = useState<{ used: number; total: number } | null>(null)
  const [quotaError, setQuotaError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuota()
  }, [])

  const fetchQuota = async () => {
    setQuota({ used: 0, total: 10 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResponse('Loading...')

    
    setResponse('Response data here')
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Tester</h1>
      
      {/* Quota display */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">API Quota</h2>
        {quotaError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{quotaError}</AlertDescription>
          </Alert>
        ) : quota ? (
          <>
            <Progress value={(quota.used / quota.total) * 100} className="mb-2" />
            <p>{quota.used} / {quota.total} requests used</p>
          </>
        ) : (
          <p>Loading quota information...</p>
        )}
      </div>

      {/* Documentation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {documentationLinks.map((doc, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <Button className="m-4" variant="outline" asChild>
              <a href={doc.link} target="_blank" rel="noopener noreferrer">View Docs</a>
            </Button>
          </Card>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-4">
        <div>
          <Label htmlFor="api-select">Select API</Label>
          <Select value={selectedApi} onValueChange={setSelectedApi}>
            <SelectTrigger id="api-select">
              <SelectValue placeholder="Select an API" />
            </SelectTrigger>
            <SelectContent>
              {apiOptions.map((option) => (
                <SelectItem key={option.endpoint} value={option.endpoint}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="method-select">HTTP Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger id="method-select">
              <SelectValue placeholder="Select HTTP method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="params">Query Parameters</Label>
          <Input
            id="params"
            placeholder="e.g. id=1&name=John"
            value={params}
            onChange={(e) => setParams(e.target.value)}
          />
        </div>

        <Button type="submit">Send Request</Button>
      </form>

      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <Label htmlFor="response">Response</Label>
        <Textarea
          id="response"
          value={response}
          readOnly
          className="h-64 font-mono"
        />
      </div>
    </div>
  )
}
