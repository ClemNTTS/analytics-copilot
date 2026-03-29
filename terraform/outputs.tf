output "container_app_url" {
  description = "The FQDN of the container app."
  value       = azurerm_container_app.app.ingress[0].fqdn
}

output "acr_login_server" {
  description = "The login server for the Azure Container Registry."
  value       = azurerm_container_registry.acr.login_server
}

output "key_vault_name" {
  description = "The name of the Key Vault."
  value       = azurerm_key_vault.kv.name
}
