export type Role = 'super_admin' | 'client'
export type AccountStatus = 'pending' | 'active' | 'disabled'
export type PyramidStatus = 'not_started' | 'in_progress' | 'complete'
export type ConversationModule = 'build' | 'consume'
export type MessageRole = 'user' | 'assistant' | 'tool'

export interface Profile {
  id: string
  role: Role
  status: AccountStatus
  name: string | null
  username: string | null
  email: string | null
  approved_at: string | null
  approved_by: string | null
  created_at: string
}

export interface Chart {
  id: string
  client_id: string
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_lat: number | null
  birth_lng: number | null
  ayanamsa: string
  house_system: string
  created_at: string
}

export interface PyramidLayer {
  id: string
  chart_id: string
  layer: string
  sublayer: string
  status: PyramidStatus
  version: string | null
  updated_at: string
}

export interface Document {
  id: string
  chart_id: string
  layer: string
  name: string
  storage_path: string
  version: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  chart_id: string
  user_id: string
  module: ConversationModule
  title: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string | null
  tool_calls: unknown | null
  created_at: string
}

export interface Report {
  id: string
  chart_id: string
  domain: string
  title: string
  storage_path: string
  version: string
  created_at: string
  updated_at: string
}
