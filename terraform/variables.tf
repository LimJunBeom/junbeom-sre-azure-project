variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "image-thumbnail-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "storage_account_name" {
  description = "Name of the storage account"
  type        = string
  default     = "imagethumbnailstorage"
}

variable "function_app_name" {
  description = "Name of the function app"
  type        = string
  default     = "image-thumbnail-function"
}

variable "app_service_plan_name" {
  description = "Name of the app service plan"
  type        = string
  default     = "image-thumbnail-plan"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "image-thumbnail"
    ManagedBy   = "terraform"
  }
}
