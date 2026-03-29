resource "azurerm_log_analytics_workspace" "log" {
  name                = "log-${var.project_name}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "env" {
  name                       = "cae-${var.project_name}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log.id
}

resource "azurerm_container_app" "app" {
  name                         = "ca-${var.project_name}"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  identity {
    type = "SystemAssigned"
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }

  secret {
    name  = "llm-api-key"
    value = var.mistral_api_key
  }

  secret {
    name  = "db-password"
    value = var.db_password
  }

  secret {
    name  = "postgres-admin-password"
    value = var.postgres_admin_password
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "registry-password"
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    container {
      name   = "next-app"
      image  = "${azurerm_container_registry.acr.login_server}/analytics-copilot-app:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name        = "AI_API_KEY"
        secret_name = "llm-api-key"
      }

      env {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_username}:${var.db_password}@localhost:5432/analytics_demo"
      }
    }

    container {
      name   = "postgres-db"
      image  = "${azurerm_container_registry.acr.login_server}/analytics-copilot-db:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "POSTGRES_USER"
        value = "admin"
      }

      env {
        name        = "POSTGRES_PASSWORD"
        secret_name = "postgres-admin-password"
      }

      env {
        name  = "POSTGRES_DB"
        value = "analytics_demo"
      }
    }

    min_replicas = 0
    max_replicas = 1
  }
}
