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

### Option A: Using Azure Functions Core Tools

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

### Option B: Using Azure Portal

1. Go to Azure Portal
2. Navigate to your Function App
3. Go to "Deployment Center"
4. Set up GitHub integration or use ZIP deployment

## Step 4: Configure Environment Variables

In Azure Portal, go to your Function App > Configuration and add:

```
STORAGE_CONNECTION_STRING=<your-storage-connection-string>
THUMBNAIL_CONTAINER=thumbnails
IMAGE_CONTAINER=images
```

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
```

## Step 6: Monitor and Verify

1. Check Azure Function logs in Azure Portal
2. Verify thumbnails are created in the thumbnails container
3. Monitor costs in Azure Cost Management

## Cost Optimization Tips

1. **Use Consumption Plan**: Already configured for free tier
2. **Monitor Usage**: Check Azure Cost Management regularly
3. **Set Budget Alerts**: Configure spending limits
4. **Clean Up**: Delete unused resources when not needed

## Troubleshooting

### Common Issues

1. **Function not triggering**: Check blob trigger path and connection string
2. **Sharp library errors**: Ensure Node.js version compatibility
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

## Cleanup

To avoid charges, clean up resources when done:

```bash
cd terraform
terraform destroy
```

**Warning**: This will delete all resources. Make sure to backup any important data.
