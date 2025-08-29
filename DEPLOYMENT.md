# Deployment Guide

## Prerequisites

1. **Azure CLI** installed and configured
2. **Terraform** installed (version >= 1.0)
3. **Node.js** installed (version >= 18)
4. **Azure Subscription** with free tier access

## Step 1: Azure CLI Login

```bash
az login
az account set --subscription <your-subscription-id>
```

## Step 2: Deploy Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

After successful deployment, note the outputs:
- Storage account name
- Function app name
- Storage connection string

## Step 3: Deploy Azure Function

### Option A: Using Azure Portal (Recommended for Free Tier)

1. Go to Azure Portal
2. Navigate to your Function App
3. Go to "Deployment Center"
4. Choose "GitHub" as source
5. Connect your GitHub repository
6. Set build provider to "GitHub Actions" or "Azure Pipelines"
7. Deploy

### Option B: Using Azure Functions Core Tools

```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Navigate to function directory
cd functions/ResizeImage

# Install dependencies
npm install

# Deploy function
func azure functionapp publish <function-app-name>
```

## Step 4: Verify Configuration

The Function App should have these app settings (automatically set by Terraform):
- `AzureWebJobsStorage` - Storage connection string
- `SCM_DO_BUILD_DURING_DEPLOYMENT` - "true" (for sharp library)
- `FUNCTIONS_EXTENSION_VERSION` - "~4"
- `WEBSITE_RUN_FROM_PACKAGE` - "1"

## Step 5: Test the Setup

```bash
cd blob-scripts

# Install dependencies
npm install

# Set environment variable
export STORAGE_CONNECTION_STRING="<your-storage-connection-string>"

# Upload a test image
node upload-test.js upload <path-to-test-image>

# List uploaded images
node upload-test.js list

# List generated thumbnails
node upload-test.js thumbnails
```

## Step 6: Monitor and Verify

1. Check Azure Function logs in Azure Portal
2. Verify thumbnails are created in the thumbnails container
3. Monitor costs in Azure Cost Management

## Cost Optimization Tips

1. **Use Consumption Plan**: Already configured for free tier (Y1)
2. **Monitor Usage**: Check Azure Cost Management regularly
3. **Set Budget Alerts**: Configure spending limits
4. **Clean Up**: Delete unused resources when not needed

## Free Tier Limits

- **Azure Functions**: 1 million executions per month free
- **Blob Storage**: 5GB free for 12 months
- **Region**: East US (configured)

## Troubleshooting

### Common Issues

1. **Function not triggering**: Check blob trigger path and AzureWebJobsStorage connection
2. **Sharp library errors**: Ensure SCM_DO_BUILD_DURING_DEPLOYMENT=true is set
3. **Permission errors**: Verify managed identity role assignments
4. **Storage access issues**: Check container access policies

### Useful Commands

```bash
# Check function logs
az functionapp logs tail --name <function-app-name> --resource-group <resource-group-name>

# List function app settings
az functionapp config appsettings list --name <function-app-name> --resource-group <resource-group-name>

# Update function app settings
az functionapp config appsettings set --name <function-app-name> --resource-group <resource-group-name> --settings "SETTING_NAME=VALUE"
```

## Local Development

For local testing with Azurite (free storage emulator):

```bash
# Install Azurite
npm install -g azurite

# Start Azurite
azurite

# In another terminal, test locally
cd functions
func start
```

## Cleanup

To avoid charges, clean up resources when done:

```bash
cd terraform
terraform destroy
```

**Warning**: This will delete all resources. Make sure to backup any important data.
