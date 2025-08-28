output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "function_app_name" {
  description = "Name of the function app"
  value       = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  description = "URL of the function app"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "storage_connection_string" {
  description = "Storage account connection string"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "images_container_name" {
  description = "Name of the images container"
  value       = azurerm_storage_container.images.name
}

output "thumbnails_container_name" {
  description = "Name of the thumbnails container"
  value       = azurerm_storage_container.thumbnails.name
}

output "managed_identity_principal_id" {
  description = "Principal ID of the managed identity"
  value       = azurerm_user_assigned_identity.function.principal_id
}
