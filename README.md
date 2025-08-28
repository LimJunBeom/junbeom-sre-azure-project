# Azure Image Upload & Thumbnail Generator

## Project Overview
This project implements a simple serverless image processing pipeline using **Azure Blob Storage** and **Azure Functions**.  
When a user uploads an image, the Function is automatically triggered to generate a thumbnail and return the final image access URL.

## Key Features
- **Image Upload**: Users upload images to Blob Storage container
- **Event-based Trigger**: Azure Function automatically executes when upload event occurs
- **Thumbnail Generation**: Resize uploaded images and store in separate container
- **URL Return**: Generate and return accessible URL for thumbnail images

## Technology Stack
- **Azure Blob Storage** (Image storage)
- **Azure Functions** (Serverless event processing)
- **Node.js** (Function App code)

## Free Tier Conditions
- Blob Storage: 5GB (12 months free)
- Azure Functions: Always Free (1 million executions per month free)

## Usage Scenario
1. User uploads image to Blob Storage
2. Blob Trigger Function executes to generate thumbnail
3. Thumbnail is stored in separate container and URL is returned
4. User can view thumbnail via returned URL in web/app

## Project Structure
```
azure-image-thumbnail/
│
├── functions/                    # Azure Functions code
│ └── ResizeImage/               # Image resize function
│     ├── index.js
│     └── function.json
│
├── blob-scripts/                # Blob Storage upload/test scripts
│ └── upload-test.js
│
├── terraform/                   # Infrastructure as Code
│ ├── main.tf
│ ├── variables.tf
│ └── outputs.tf
│
└── README.md                    # Project documentation
```

## Expected Benefits
- Build image processing pipeline without managing servers or VMs directly
- Completely serverless architecture with excellent scalability
- Suitable for portfolio and learning mini-projects

## Cost Management
- Uses Azure Free Tier to minimize costs
- Region: East US
- Monitor usage to stay within free tier limits

## Setup Instructions
1. Deploy infrastructure using Terraform
2. Configure Azure Functions
3. Test image upload and thumbnail generation
4. Monitor costs and usage

## Security Notes
- All storage accounts use private access
- Functions use managed identity for secure access
- No hardcoded credentials in code