variable "location" {
  description = "The Azure region to deploy resources in."
  type        = string
  default     = "westeurope"
}

variable "project_name" {
  description = "The name of the project, used for resource naming."
  type        = string
  default     = "analytics-copilot-demo"
}

variable "mistral_api_key" {
  description = "The API key for Mistral AI."
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "The database user."
  type        = string
  default     = "llm_user"
}

variable "db_password" {
  description = "The database password."
  type        = string
  sensitive   = true
}

variable "postgres_admin_password" {
  description = "The admin password for the PostgreSQL container."
  type        = string
  sensitive   = true
}

variable "acr_name" {
  description = "The name of the Azure Container Registry."
  type        = string
  default     = "acranalyticscopilot"
}
