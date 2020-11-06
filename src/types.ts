import { Pool } from 'pg'
import { Redis } from 'ioredis'
import { PluginEvent, PluginAttachment } from 'posthog-plugins'
import { VM, VMScript } from 'vm2'

export interface PluginsServerConfig {
    CELERY_DEFAULT_QUEUE: string
    DATABASE_URL: string
    PLUGINS_CELERY_QUEUE: string
    REDIS_URL: string
    BASE_DIR: string
    PLUGINS_RELOAD_PUBSUB_CHANNEL: string
}

export interface PluginsServer extends PluginsServerConfig {
    db: Pool
    redis: Redis
}

export type PluginId = number
export type PluginConfigId = number
export type TeamId = number

export interface Plugin {
    id: PluginId
    name: string
    description: string
    url: string
    config_schema: Record<string, PluginConfigSchema>
    tag: string
    archive: Buffer | null
    from_json: boolean
    from_web: boolean
    error?: PluginError
}

export interface PluginConfig {
    id: PluginConfigId
    team_id: TeamId
    plugin: Plugin
    plugin_id: PluginId
    enabled: boolean
    order: number
    config: Record<string, unknown>
    error?: PluginError
    attachments?: Record<string, PluginAttachment>
    vm?: PluginConfigVMReponse | null
}

export interface PluginJsonConfig {
    name?: string
    description?: string
    url?: string
    main?: string
    lib?: string
    config?: Record<string, PluginConfigSchema>
}

export interface PluginConfigSchema {
    name: string
    type: 'string' | 'file'
    default: string
    required: boolean
}

export interface PluginError {
    message: string
    time: string
    name?: string
    stack?: string
    event?: PluginEvent | null
}

export interface PluginAttachmentDB {
    id: number
    team_id: TeamId
    plugin_config_id: PluginConfigId
    key: string
    content_type: string
    file_name: string
    contents: Buffer | null
}

export interface PluginScript {
    plugin: Plugin
    script: VMScript
    processEvent: boolean
    setupTeam: boolean
}

export interface PluginConfigVMReponse {
    vm: VM
    methods: {
        processEvent: (event: PluginEvent) => PluginEvent
    }
}
